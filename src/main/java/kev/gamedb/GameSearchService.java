package kev.gamedb;

import kev.gamedb.dto.GameSearchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Service
public class GameSearchService {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Game> searchGames(GameSearchDTO criteria) {
        List<Criteria> filters = new ArrayList<>();

        // 1. Map 'searchTerm' to the 'name' field in MongoDB
        if (criteria.getSearchTerm() != null && !criteria.getSearchTerm().isEmpty()) {
            String pattern = criteria.isFuzzy() ? criteria.getSearchTerm() : ".*" + criteria.getSearchTerm() + ".*";
            filters.add(Criteria.where("name").regex(pattern, "i"));
        }

        // 2. Multi-field Array Filtering (Genres, Platforms, Themes)
        if (criteria.getGenres() != null && !criteria.getGenres().isEmpty()) {
            filters.add(Criteria.where("genres").in(criteria.getGenres()));
        }
        if (criteria.getPlatforms() != null && !criteria.getPlatforms().isEmpty()) {
            filters.add(Criteria.where("platforms").in(criteria.getPlatforms()));
        }

        // 3. Year-Based Range Filtering
        // We convert years to Instants to match the MongoDB 'releaseDate' field type
        if (criteria.getMinReleaseYear() != null && criteria.getMinReleaseYear() > 0) {
            filters.add(Criteria.where("first_release_date").regex("^" + criteria.getMinReleaseYear()));
        }
        if (criteria.getMaxReleaseYear() != null) {
            Instant end = OffsetDateTime.of(criteria.getMaxReleaseYear(), 12, 31, 23, 59, 59, 0, ZoneOffset.UTC).toInstant();
            filters.add(Criteria.where("releaseDate").lte(end));
        }

        // 4. Rating Filter
        // 4. Total Rating Filter (Using the confirmed 'total_rating' field)
        if (criteria.getMinTotalRating() != null) {
            filters.add(Criteria.where("total_rating").gte(criteria.getMinTotalRating()));
        }

// 5. Data Hygiene Filter: Using 'first_release_date'
        filters.add(new Criteria().andOperator(
                Criteria.where("first_release_date").exists(true),
                Criteria.where("first_release_date").ne(""),
                Criteria.where("first_release_date").ne(null)
        ));



        // Compose Aggregation Stages
        List<AggregationOperation> pipeline = new ArrayList<>();
        pipeline.add(Aggregation.match(new Criteria().andOperator(filters.toArray(new Criteria[0]))));

        // Dynamic Sorting
        Sort.Direction dir = criteria.getSortDirection().equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        pipeline.add(Aggregation.sort(dir, criteria.getSortBy()));

        // Pagination based on DTO size and page
        pipeline.add(Aggregation.skip((long) criteria.getPage() * criteria.getSize()));
        pipeline.add(Aggregation.limit(criteria.getSize()));

        Aggregation aggregation = Aggregation.newAggregation(pipeline);
        return mongoTemplate.aggregate(aggregation, "games", Game.class).getMappedResults();
    }
}
