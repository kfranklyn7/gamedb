package kev.gamedb;

import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

@Document(collection = "games")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Game {
    @Id
    @JsonIgnore
    private ObjectId id;
    @org.springframework.data.mongodb.core.index.Indexed(name = "igdbId_1")
    private Integer igdbId;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Artwork> artworks;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private Cover cover;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonManagedReference
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private Franchise franchise;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Franchise> franchises;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @Field("game_modes")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<GameModes> gameModes;
    @JsonIgnore
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Genre> genres;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Keyword> keywords;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonManagedReference
    @Field("involved_companies")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<InvolvedCompany> involvedCompanies;
    private String name;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Platform> platforms;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Screenshot> screenshots;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({"involved_companies", "cover", "similarGames", "themes", "genres", "platforms", "artworks", "screenshots", "gameModes", "franchises", "franchise"})
    @Field("similar_games")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> similarGames;
    private String slug;
    private String summary;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Theme> themes;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("collection")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private Collection collection;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @Field("as_child_relations")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> asChildRelations;
    @Field("first_release_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "MMM dd, yyyy", timezone = "UTC")
    @org.springframework.data.mongodb.core.index.Indexed(name = "releaseDate_1")
    private Instant releaseDate;

    @org.springframework.data.mongodb.core.index.Indexed(name = "total_rating_1")
    private Double total_rating;
    @Field("total_rating_count")
    private Integer totalRatingCount;
    @Field("aggregated_rating")
    private Double aggregatedRating;
    @Field("aggregated_rating_count")
    private Integer aggregatedRatingCount;
    private Double rating;
    @Field("rating_count")
    private Integer ratingCount;
    private String url;
    private String checksum;
    @Field("game_status")
    private String gameStatus;
    @Field("game_type")
    private Integer gameType;
    private String storyline;
    private Integer hypes;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Video> videos;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Website> websites;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("player_perspectives")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<PlayerPerspective> playerPerspectives;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("game_engines")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<GameEngine> gameEngines;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("age_ratings")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<AgeRating> ageRatings;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("language_supports")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<LanguageSupport> languageSupports;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("multiplayer_modes")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<MultiplayerMode> multiplayerModes;

    @Field("version_title")
    private String versionTitle;

    private String franchiseName;
    private String seriesName;

    @JsonProperty("genreNames")
    public List<String> getGenreNames() {
        if (genres == null) return null;
        return genres.stream()
                .filter(java.util.Objects::nonNull)
                .map(g -> { try { return g.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    public void setReleaseDate(Object date) {
        if (date instanceof String && ((String) date).isEmpty()) {
            this.releaseDate = null;
        } else if (date instanceof Instant) {
            this.releaseDate = (Instant) date;
        }
    }

    @JsonProperty("franchiseNames")
    public List<String> getFranchiseNames() {
        if (franchises == null) return java.util.Collections.emptyList();
        return franchises.stream()
                .filter(java.util.Objects::nonNull)
                .map(f -> { try { return f.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public String getFranchise() {
        if (franchise == null) return null;
        try { return franchise.getName(); } catch (Exception e) { return null; }
    }

    @JsonProperty("gameModes")
    public List<String> getGameModes() {
        if (gameModes == null) return java.util.Collections.emptyList();
        return gameModes.stream()
                .filter(java.util.Objects::nonNull)
                .map(gm -> { try { return gm.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("themes")
    @JsonIgnore
    public List<String> getThemes() {
        if (themes == null) return java.util.Collections.emptyList();
        return themes.stream()
                .filter(java.util.Objects::nonNull)
                .map(t -> { try { return t.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("platforms")
    public List<String> getPlatforms() {
        if (platforms == null) return java.util.Collections.emptyList();
        return platforms.stream()
                .filter(java.util.Objects::nonNull)
                .map(p -> { try { return p.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("cover")
    public String getCover() {
        if (cover == null) return null;
        try { return cover.getUrl(); } catch (Exception e) { return null; }
    }

    @JsonProperty("involved_companies")
    @JsonIgnore
    public List<String> getInvolvedCompanies() {
        if (involvedCompanies == null) return java.util.Collections.emptyList();
        return involvedCompanies.stream()
                .filter(java.util.Objects::nonNull)
                .map(ic -> { try { return ic.getCompany(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @JsonProperty("developers")
    public List<String> getDevelopers() {
        if (involvedCompanies == null) return java.util.Collections.emptyList();
        return involvedCompanies.stream()
                .filter(java.util.Objects::nonNull)
                .filter(ic -> { try { return Boolean.TRUE.equals(ic.getDeveloper()); } catch (Exception e) { return false; } })
                .map(ic -> { try { return ic.getCompany(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @JsonProperty("publishers")
    public List<String> getPublishers() {
        if (involvedCompanies == null) return java.util.Collections.emptyList();
        return involvedCompanies.stream()
                .filter(java.util.Objects::nonNull)
                .filter(ic -> { try { return Boolean.TRUE.equals(ic.getPublisher()); } catch (Exception e) { return false; } })
                .map(ic -> { try { return ic.getCompany(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    public String getSeriesName() {
        if (collection == null) return null;
        try { return collection.getName(); } catch (Exception e) { return null; }
    }

    @JsonProperty("versionHistory")
    public List<String> getVersionHistory() {
        if (asChildRelations == null) return null;
        return asChildRelations.stream()
                .filter(java.util.Objects::nonNull)
                .map(g -> { try { return g.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .toList();
    }

    @JsonProperty("total_rating_count")
    public Integer getTotalRatingCount() { return totalRatingCount; }

    @JsonProperty("aggregated_rating")
    public Double getAggregatedRating() { return aggregatedRating; }

    @JsonProperty("aggregated_rating_count")
    public Integer getAggregatedRatingCount() { return aggregatedRatingCount; }

    @JsonProperty("rating")
    public Double getRating() { return rating; }

    @JsonProperty("rating_count")
    public Integer getRatingCount() { return ratingCount; }

    @JsonProperty("url")
    public String getUrl() { return url; }

    @JsonProperty("game_status")
    public String getGameStatus() { return gameStatus; }

    @JsonProperty("game_type")
    public Integer getGameType() { return gameType; }

    @JsonProperty("storyline")
    public String getStoryline() { return storyline; }

    @JsonProperty("hypes")
    public Integer getHypes() { return hypes; }

    @JsonProperty("version_title")
    public String getVersionTitle() { return versionTitle; }

    @JsonProperty("checksum")
    public String getChecksum() { return checksum; }

    @JsonProperty("videos")
    @JsonIgnore
    public List<String> getVideos() {
        if (videos == null) return java.util.Collections.emptyList();
        return videos.stream()
                .filter(java.util.Objects::nonNull)
                .map(v -> { try { return v.getVideoId(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("websites")
    @JsonIgnore
    public List<String> getWebsites() {
        if (websites == null) return java.util.Collections.emptyList();
        return websites.stream()
                .filter(java.util.Objects::nonNull)
                .map(w -> { try { return w.getUrl(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("playerPerspectives")
    @JsonIgnore
    public List<String> getPlayerPerspectives() {
        if (playerPerspectives == null) return java.util.Collections.emptyList();
        return playerPerspectives.stream()
                .filter(java.util.Objects::nonNull)
                .map(pp -> { try { return pp.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("gameEngines")
    @JsonIgnore
    public List<String> getGameEngines() {
        if (gameEngines == null) return java.util.Collections.emptyList();
        return gameEngines.stream()
                .filter(java.util.Objects::nonNull)
                .map(ge -> { try { return ge.getName(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull)
                .distinct()
                .toList();
    }

    @JsonProperty("artworks")
    @JsonIgnore
    public List<String> getArtworks() {
        if (artworks == null) return java.util.Collections.emptyList();
        return artworks.stream().filter(java.util.Objects::nonNull)
                .map(a -> { try { return a.getImageId(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull).distinct().toList();
    }

    @JsonProperty("screenshots")
    @JsonIgnore
    public List<String> getScreenshots() {
        if (screenshots == null) return java.util.Collections.emptyList();
        return screenshots.stream().filter(java.util.Objects::nonNull)
                .map(s -> { try { return s.getImageId(); } catch (Exception e) { return null; } })
                .filter(java.util.Objects::nonNull).distinct().toList();
    }

    @JsonProperty("ageRatings")
    public List<java.util.Map<String, Object>> getAgeRatings() {
        if (ageRatings == null) return java.util.Collections.emptyList();
        return ageRatings.stream()
                .filter(java.util.Objects::nonNull)
                .map(ar -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("category", ar.getCategory());
                    map.put("rating", ar.getRating());
                    return map;
                }).toList();
    }

    @JsonProperty("similarGamesData")
    @JsonIgnore
    public List<java.util.Map<String, Object>> getSimilarGamesData() {
        if (similarGames == null) return java.util.Collections.emptyList();
        return similarGames.stream()
                .filter(java.util.Objects::nonNull)
                .map(g -> {
                    try {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("igdbId", g.getIgdbId());
                        map.put("name", g.getName());
                        if (g.getCover() != null) map.put("cover", g.getCover());
                        return map;
                    } catch (Exception e) { return null; }
                })
                .filter(java.util.Objects::nonNull)
                .toList();
    }
}
