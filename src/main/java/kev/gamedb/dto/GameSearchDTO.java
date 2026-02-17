package kev.gamedb.dto;

import lombok.Data;
import java.util.List;

@Data
public class GameSearchDTO {
    // Maps to 'name' in the Game entity
    private String searchTerm;

    // These match the List<String> transformations in your Game model's @JsonProperty methods
    private List<String> genres;
    private List<String> platforms;
    private List<String> keywords;
    private List<String> themes;
    private List<String> gameModes;
    private List<String> involvedCompanies; // Renamed from perspectives to match Game entity

    // Rating field updated to 'total_rating' as seen in your MongoDB Compass
    private Double minTotalRating;
    private Integer minReleaseYear;
    private Integer maxReleaseYear;

    // Default sorting adjusted to confirmed existing fields
    private String sortBy = "total_rating";
    private String sortDirection = "desc";
    private int page = 0;
    private int size = 20;

    private boolean fuzzy = false;
}