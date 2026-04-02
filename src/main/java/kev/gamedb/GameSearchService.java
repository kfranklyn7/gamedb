package kev.gamedb;

import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import kev.gamedb.dto.GameSearchDTO;

import java.time.Instant;
import java.time.Year;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GameSearchService {

        @Autowired
        private MongoTemplate mongoTemplate;

        public Page<GameLite> searchGames(GameSearchDTO criteria) {
                System.out.println("Starting searchGames with criteria: " + criteria);

                try {
                        MongoCollection<Document> gamesCollection = mongoTemplate.getCollection("games");

                        // 1. Build Filter
                        List<Bson> filters = new ArrayList<>();
                        if (criteria.getSearchTerm() != null && !criteria.getSearchTerm().isEmpty()) {
                                filters.add(Filters.regex("name", criteria.getSearchTerm(), "i"));
                        }
                        if (criteria.getPlatforms() != null && !criteria.getPlatforms().isEmpty()) {
                                List<Long> ids = new ArrayList<>();
                                for (String s : criteria.getPlatforms())
                                        ids.add(Long.parseLong(s));
                                filters.add(Filters.all("platforms", ids));
                        }
                        if (criteria.getGenres() != null && !criteria.getGenres().isEmpty()) {
                                List<Long> ids = new ArrayList<>();
                                for (String s : criteria.getGenres())
                                        ids.add(Long.parseLong(s));
                                filters.add(Filters.in("genres", ids));
                        }
                        if (criteria.getThemes() != null && !criteria.getThemes().isEmpty()) {
                                List<Long> ids = new ArrayList<>();
                                for (String s : criteria.getThemes())
                                        ids.add(Long.parseLong(s));
                                filters.add(Filters.in("themes", ids));
                        }
                        if (criteria.getMinTotalRating() != null) {
                                filters.add(Filters.gte("total_rating", criteria.getMinTotalRating()));
                        }

                        if (criteria.getMinReleaseYear() != null || criteria.getMaxReleaseYear() != null) {
                                List<Bson> yearFilters = new ArrayList<>();
                                if (criteria.getMinReleaseYear() != null) {
                                        Date start = Date.from(Year.of(criteria.getMinReleaseYear()).atDay(1)
                                                        .atStartOfDay().toInstant(ZoneOffset.UTC));
                                        yearFilters.add(Filters.gte("first_release_date", start));
                                }
                                if (criteria.getMaxReleaseYear() != null) {
                                        Date end = Date.from(Year.of(criteria.getMaxReleaseYear())
                                                        .atDay(Year.of(criteria.getMaxReleaseYear()).length())
                                                        .atTime(23, 59, 59).toInstant(ZoneOffset.UTC));
                                        yearFilters.add(Filters.lte("first_release_date", end));
                                }
                                if (!yearFilters.isEmpty()) {
                                        filters.add(Filters.and(yearFilters));
                                }
                        }

                        // Default sorting/visibility fixes
                        boolean hasFilters = (criteria.getSearchTerm() != null && !criteria.getSearchTerm().isEmpty())
                                        || (criteria.getPlatforms() != null && !criteria.getPlatforms().isEmpty())
                                        || (criteria.getGenres() != null && !criteria.getGenres().isEmpty())
                                        || (criteria.getThemes() != null && !criteria.getThemes().isEmpty());

                        if (!hasFilters) {
                                // Default broad search should only show MAIN GAME (0), REMAKE (8), or REMASTER (9)
                        // Also allow games where game_type is absent (legacy data synced before the field existed)
                        filters.add(Filters.or(
                                Filters.in("game_type", 0, 8, 9),
                                Filters.exists("game_type", false)
                        ));
                                // Make sure it has some rating or cover so blank entries don't flood the top
                                filters.add(Filters.or(
                                        Filters.exists("total_rating_count", true),
                                        Filters.exists("cover", true)
                                ));
                        }

                        Bson finalFilter = filters.isEmpty() ? new Document() : Filters.and(filters);

                        // 2. Count
                        long total = gamesCollection.countDocuments(finalFilter);

                        // 3. Sorting
                        String sortBy = criteria.getSortBy() != null ? criteria.getSortBy() : "total_rating";
                        if (sortBy.equals("rating"))
                                sortBy = "total_rating";
                        if (sortBy.equals("releaseDate"))
                                sortBy = "first_release_date";

                        boolean isAscending = "asc".equalsIgnoreCase(criteria.getSortDirection());
                        Bson sortBson = isAscending ? Sorts.ascending(sortBy) : Sorts.descending(sortBy);

                        // 4. Pagination
                        int page = criteria.getPage();
                        int size = criteria.getSize();
                        if (size <= 0)
                                size = 20;
                        int skip = page * size;

                        // 5. Aggregation Pipeline (Raw)
                        List<Bson> pipeline = new ArrayList<>();
                        pipeline.add(new Document("$match", finalFilter));
                        pipeline.add(new Document("$sort", sortBson));
                        pipeline.add(new Document("$skip", skip));
                        pipeline.add(new Document("$limit", size));

                        // Lookups
                        pipeline.add(new Document("$lookup",
                                        new Document("from", "platforms").append("localField", "platforms")
                                                        .append("foreignField", "igdbId")
                                                        .append("as", "platformObjects")));
                        pipeline.add(new Document("$lookup",
                                        new Document("from", "genres").append("localField", "genres")
                                                        .append("foreignField", "igdbId")
                                                        .append("as", "genreObjects")));
                        pipeline.add(new Document("$lookup",
                                        new Document("from", "themes").append("localField", "themes")
                                                        .append("foreignField", "igdbId")
                                                        .append("as", "themeObjects")));
                        // 1. Lookup involved_companies bridging collection
                        pipeline.add(new Document("$lookup",
                                        new Document("from", "involved_companies").append("localField", "igdbId")
                                                        .append("foreignField", "game")
                                                        .append("as", "companyRelations")));

                        // 2. Lookup the actual company names from the companies collection using the
                        // company ids
                        pipeline.add(new Document("$lookup",
                                        new Document("from", "companies")
                                                        .append("localField", "companyRelations.company")
                                                        .append("foreignField", "igdbId")
                                                        .append("as", "involvedCompanyObjects")));
                        pipeline.add(new Document("$lookup",
                                        new Document("from", "covers").append("localField", "cover")
                                                        .append("foreignField", "igdbId").append("as", "coverObject")));
                        pipeline.add(new Document("$unwind", new Document("path", "$coverObject")
                                        .append("preserveNullAndEmptyArrays", true)));

                        // 6. Project Stage - CRITICAL: Extract only primitives to avoid any DBRef leaks
                        Document project = new Document();
                        project.append("igdbId", 1);
                        project.append("name", 1);
                        project.append("slug", 1);
                        project.append("summary", 1);
                        project.append("total_rating", 1);
                        project.append("community_rating", 1);
                        project.append("community_rating_count", 1);
                        project.append("releaseDate", "$first_release_date"); // ALIASING

                        project.append("genreNames", new Document("$map", new Document("input", "$genreObjects")
                                        .append("as", "g").append("in", "$$g.name")));
                        project.append("platformNames", new Document("$map", new Document("input", "$platformObjects")
                                        .append("as", "p").append("in", "$$p.name")));
                        project.append("platformData",
                                        new Document("$map", new Document("input", "$platformObjects").append("as", "p")
                                                        .append("in", new Document("id", "$$p.igdbId")
                                                                        .append("name", "$$p.name")
                                                                        .append("logoUrl", "$$p.platformLogoUrl"))));
                        project.append("themeNames", new Document("$map", new Document("input", "$themeObjects")
                                        .append("as", "t").append("in", "$$t.name")));

                        // Involved Companies
                        // Filter out just the Developers by checking the bridging collection, then
                        // mapped to names
                        project.append("involvedCompanyNames",
                                        new Document("$map", new Document("input", "$involvedCompanyObjects")
                                                        .append("as", "c").append("in", "$$c.name")));

                        // To keep it performant and simple for the DTO without writing a massive nested
                        // To keep it performant and simple for the DTO without writing a massive nested
                        // $filter,
                        // we pass the resolved company objects to the frontend. The frontend's
                        // `extractName`
                        // successfully pulls `arr[0].name` from these maps.
                        project.append("developers",
                                        new Document("$map", new Document("input", "$involvedCompanyObjects")
                                                        .append("as", "c")
                                                        .append("in", new Document("name", "$$c.name"))));

                        project.append("publishers",
                                        new Document("$map", new Document("input", "$involvedCompanyObjects")
                                                        .append("as", "c")
                                                        .append("in", new Document("name", "$$c.name"))));

                        project.append("coverUrl", "$coverObject.url");

                        pipeline.add(new Document("$project", project));

                        List<Document> rawResults = new ArrayList<>();
                        gamesCollection.aggregate(pipeline).forEach(rawResults::add);

                        // 7. Manual Mapping to GameLite
                        List<GameLite> content = rawResults.stream().map(doc -> {
                                System.out.println("DEBUG Game: " + doc.getString("name") + " | Genres: "
                                                + doc.get("genreNames") + " | Themes: " + doc.get("themeNames"));
                                GameLite lite = new GameLite();
                                lite.setIgdbId(doc.getInteger("igdbId"));
                                lite.setName(doc.getString("name"));
                                lite.setSlug(doc.getString("slug"));
                                lite.setSummary(doc.getString("summary"));
                                lite.setTotal_rating(doc.get("total_rating") instanceof Number
                                                ? ((Number) doc.get("total_rating")).doubleValue()
                                                : null);

                                if (doc.get("community_rating") instanceof Number) {
                                        lite.setCommunityRating(((Number) doc.get("community_rating")).doubleValue());
                                }
                                if (doc.get("community_rating_count") instanceof Number) {
                                        lite.setCommunityRatingCount(((Number) doc.get("community_rating_count")).intValue());
                                }

                                Object rd = doc.get("releaseDate");
                                if (rd instanceof Date)
                                        lite.setReleaseDate(((Date) rd).toInstant());
                                else if (rd instanceof Instant)
                                        lite.setReleaseDate((Instant) rd);

                                lite.setGenreNames((List<String>) doc.get("genreNames"));
                                lite.setPlatformNames((List<String>) doc.get("platformNames"));
                                lite.setPlatformData((List<Map<String, Object>>) doc.get("platformData"));
                                lite.setThemeNames((List<String>) doc.get("themeNames"));
                                lite.setCoverUrl(doc.getString("coverUrl"));
                                lite.setInvolvedCompanyNames((List<String>) doc.get("involvedCompanyNames"));
                                lite.setDevelopers((List<Map<String, Object>>) doc.get("developers"));

                                return lite;
                        }).collect(Collectors.toList());

                        System.out.println("Search complete. Returning results.");
                        return new PageImpl<>(content, PageRequest.of(page, size), total);

                } catch (Exception e) {
                        System.err.println("CRITICAL ERROR in GameSearchService: " + e.getMessage());
                        e.printStackTrace();
                        throw e;
                }
        }
}
