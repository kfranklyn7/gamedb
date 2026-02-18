package kev.gamedb;

import kev.gamedb.dto.GameSearchDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.MongoExpression;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.TextCriteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameSearchService {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<Game> searchGames(GameSearchDTO criteria) {
        List<AggregationOperation> pipeline = new ArrayList<>();

        // 1. FAST INITIAL MATCH (Uses Text Index)
        if (criteria.getSearchTerm() != null && !criteria.getSearchTerm().isEmpty()) {
            pipeline.add(Aggregation.match(TextCriteria.forDefaultLanguage()
                    .matchingAny(criteria.getSearchTerm())));

            // Add score immediately for sorting
            pipeline.add(Aggregation.addFields()
                    .addFieldWithValue("score", MongoExpression.create("{\"$meta\": \"textScore\"}"))
                    .build());
        }

        // 2. CONSTRUCT FILTERS
        List<Criteria> filters = new ArrayList<>();
        if (criteria.getGenres() != null && !criteria.getGenres().isEmpty()) filters.add(Criteria.where("genres").in(criteria.getGenres()));
        if (criteria.getPlatforms() != null && !criteria.getPlatforms().isEmpty()) filters.add(Criteria.where("platforms").in(criteria.getPlatforms()));
        if (criteria.getThemes() != null && !criteria.getThemes().isEmpty()) filters.add(Criteria.where("themes").in(criteria.getThemes()));
        if (criteria.getGameModes() != null && !criteria.getGameModes().isEmpty()) filters.add(Criteria.where("game_modes").in(criteria.getGameModes()));
        if (criteria.getInvolvedCompanies() != null && !criteria.getInvolvedCompanies().isEmpty()) filters.add(Criteria.where("involved_companies").in(criteria.getInvolvedCompanies()));
        if (criteria.getMinTotalRating() != null) filters.add(Criteria.where("total_rating").gte(criteria.getMinTotalRating()));
        
        if (criteria.getMinReleaseYear() != null || criteria.getMaxReleaseYear() != null) {
            Criteria dateCriteria = Criteria.where("first_release_date");
            if (criteria.getMinReleaseYear() != null) {
                java.time.Instant start = java.time.Year.of(criteria.getMinReleaseYear()).atDay(1).atStartOfDay(java.time.ZoneOffset.UTC).toInstant();
                dateCriteria.gte(start);
            }
            if (criteria.getMaxReleaseYear() != null) {
                java.time.Instant end = java.time.Year.of(criteria.getMaxReleaseYear()).atMonth(12).atDay(31).atTime(23, 59, 59).toInstant(java.time.ZoneOffset.UTC);
                dateCriteria.lte(end);
            }
            filters.add(dateCriteria);
        }

        if (!filters.isEmpty()) {
            pipeline.add(Aggregation.match(new Criteria().andOperator(filters.toArray(new Criteria[0]))));
        }

        // 3. SORT & PAGINATE FIRST
        String sortByField = criteria.getSortBy();
        if (sortByField == null || sortByField.isEmpty()) {
            sortByField = (criteria.getSearchTerm() != null) ? "score" : "total_rating";
        }
        Sort.Direction dir = (criteria.getSortDirection() != null && criteria.getSortDirection().equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        pipeline.add(Aggregation.sort(dir, sortByField));
        pipeline.add(Aggregation.skip((long) criteria.getPage() * criteria.getSize()));
        pipeline.add(Aggregation.limit(criteria.getSize()));

        // 4. CLEAN DATA FOR JOINS (Safely handle dirty stringified arrays)
        // Correcting JSON syntax: all operators must be quoted.
        // Also: There is no $isString operator. We use { $type: "string" }
        String cleanArrayExp = " { \"$cond\": { " +
                "\"if\": { \"$isArray\": \"$%s\" }, " +
                "\"then\": \"$%s\", " +
                "\"else\": { \"$cond\": { " +
                    "\"if\": { \"$and\": [ { \"$eq\": [{ \"$type\": \"$%s\" }, \"string\"] }, { \"$ne\": [\"$%s\", \"\"] } ] }, " +
                    "\"then\": { \"$filter\": { " +
                        "\"input\": { \"$map\": { " +
                            "\"input\": { \"$split\": [ { \"$replaceAll\": { \"input\": { \"$replaceAll\": { \"input\": \"$%s\", \"find\": \"[\", \"replacement\": \"\" } }, \"find\": \"]\", \"replacement\": \"\" } }, \",\" ] }, " +
                            "\"as\": \"id\", " +
                            "\"in\": { \"$convert\": { \"input\": { \"$trim\": { \"input\": \"$$id\" } }, \"to\": \"int\", \"onError\": null, \"onNull\": null } } " +
                        "} }, " +
                        "\"as\": \"val\", " +
                        "\"cond\": { \"$ne\": [\"$$val\", null] } " +
                    "} }, " +
                    "\"else\": [] " +
                "} } " +
            "} } ";

        pipeline.add(Aggregation.addFields()
                .addFieldWithValue("cleanPlatforms", MongoExpression.create(String.format(cleanArrayExp, "platforms", "platforms", "platforms", "platforms", "platforms")))
                .addFieldWithValue("cleanGenres", MongoExpression.create(String.format(cleanArrayExp, "genres", "genres", "genres", "genres", "genres")))
                .addFieldWithValue("cleanThemes", MongoExpression.create(String.format(cleanArrayExp, "themes", "themes", "themes", "themes", "themes")))
                .addFieldWithValue("cleanModes", MongoExpression.create(String.format(cleanArrayExp, "game_modes", "game_modes", "game_modes", "game_modes", "game_modes")))
                .addFieldWithValue("cleanInvolved", MongoExpression.create(String.format(cleanArrayExp, "involved_companies", "involved_companies", "involved_companies", "involved_companies", "involved_companies")))
                .addFieldWithValue("cleanFranchises", MongoExpression.create(String.format(cleanArrayExp, "franchises", "franchises", "franchises", "franchises", "franchises")))
                .addFieldWithValue("cleanCollections", MongoExpression.create(String.format(cleanArrayExp, "collections", "collections", "collections", "collections", "collections")))
                .build());

        // 5. LOOKUPS
        pipeline.add(Aggregation.lookup("platforms", "cleanPlatforms", "igdbId", "platforms"));
        pipeline.add(Aggregation.lookup("genres", "cleanGenres", "igdbId", "genres"));
        pipeline.add(Aggregation.lookup("themes", "cleanThemes", "igdbId", "themes"));
        pipeline.add(Aggregation.lookup("game_modes", "cleanModes", "igdbId", "game_modes"));
        pipeline.add(Aggregation.lookup("franchises", "cleanFranchises", "igdbId", "franchises"));
        pipeline.add(Aggregation.lookup("collections", "cleanCollections", "id", "collectionObjects"));
        
        // Complex lookup for involved_companies to get company data
        pipeline.add(Aggregation.lookup("involved_companies", "cleanInvolved", "igdbId", "involved_companies"));

        // 6. FINAL MAPPING & NAME EXTRACTION
        pipeline.add(Aggregation.addFields()
                .addFieldWithValue("franchiseName", MongoExpression.create("{\"$arrayElemAt\": [\"$franchises.name\", 0]}"))
                .addFieldWithValue("seriesName", MongoExpression.create("{\"$arrayElemAt\": [\"$collectionObjects.name\", 0]}"))
                .addFieldWithValue("collection", MongoExpression.create("{\"$arrayElemAt\": [\"$collectionObjects\", 0]}"))
                .build());

        return mongoTemplate.aggregate(Aggregation.newAggregation(pipeline), "games", Game.class).getMappedResults();
    }
}