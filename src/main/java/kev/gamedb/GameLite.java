package kev.gamedb;

import com.fasterxml.jackson.annotation.*;
import lombok.Data;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GameLite {
    private Integer igdbId;
    private String name;
    private String slug;
    private String summary;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MMM dd, yyyy", timezone = "UTC")
    private Instant releaseDate;

    private Double total_rating;

    @JsonProperty("genreNames")
    private List<String> genreNames;

    @JsonProperty("platforms")
    private List<String> platformNames;

    @JsonProperty("platformData")
    private List<Map<String, Object>> platformData;

    @JsonProperty("themes")
    private List<String> themeNames;

    @JsonProperty("cover")
    private String coverUrl;

    @JsonProperty("involved_companies")
    private List<String> involvedCompanyNames;

    @JsonProperty("developers")
    private List<Map<String, Object>> developers;
}
