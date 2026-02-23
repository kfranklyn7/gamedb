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
    private List<Artwork> artworks;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    private Cover cover;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonManagedReference
    @JsonIgnore
    private Franchise franchise;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonManagedReference
    private List<Franchise> franchises;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @Field("game_modes")
    private List<GameModes> gameModes;
    @JsonIgnore
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    private List<Genre> genres;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private List<Keyword> keywords;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonManagedReference
    @Field("involved_companies")
    @JsonIgnore
    private List<InvolvedCompany> involvedCompanies;
    private String name;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    private List<Platform> platforms;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private List<Screenshot> screenshots;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({"involved_companies", "cover", "similarGames", "themes", "genres", "platforms", "artworks", "screenshots", "gameModes", "franchises", "franchise"})
    @Field("similar_games")
    @JsonIgnore
    private List<Game> similarGames;
    private String slug;
    private String summary;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private List<Theme> themes;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("collection")
    private Collection collection;
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @Field("as_child_relations")
    @JsonIgnore
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
    private List<Video> videos;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private List<Website> websites;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("player_perspectives")
    private List<PlayerPerspective> playerPerspectives;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("game_engines")
    private List<GameEngine> gameEngines;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("age_ratings")
    private List<AgeRating> ageRatings;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("language_supports")
    private List<LanguageSupport> languageSupports;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("multiplayer_modes")
    private List<MultiplayerMode> multiplayerModes;

    @Field("version_title")
    private String versionTitle;

    private String franchiseName;
    private String seriesName;

    @JsonProperty("genreNames")
    public List<String> getGenreNames() {
        if (genres == null) return null;
        return genres.stream().map(Genre::getName).distinct().toList();
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
        return franchises.stream().map(Franchise::getName).toList();
    }

    public String getFranchise() {
        return (franchise != null) ? franchise.getName() : null;
    }

    @JsonProperty("gameModes")
    public List<String> getGameModes() {
        if (gameModes == null) return java.util.Collections.emptyList();
        return gameModes.stream().map(GameModes::getName).distinct().toList();
    }

    @JsonProperty("themes")
    public List<String> getThemes() {
        if (themes == null) return java.util.Collections.emptyList();
        return themes.stream().map(Theme::getName).distinct().toList();
    }

    @JsonProperty("platforms")
    public List<String> getPlatforms() {
        if (platforms == null) return java.util.Collections.emptyList();
        return platforms.stream().map(Platform::getName).distinct().toList();
    }

    @JsonProperty("cover")
    public String getCover() {
        return (cover != null) ? cover.getUrl() : null;
    }

    @JsonProperty("involved_companies")
    public List<String> getInvolvedCompanies() {
        if (involvedCompanies == null) return java.util.Collections.emptyList();
        return involvedCompanies.stream().map(InvolvedCompany::getCompany).toList();
    }

    @JsonProperty("developers")
    public List<String> getDevelopers() {
        if (involvedCompanies == null) return java.util.Collections.emptyList();
        return involvedCompanies.stream()
                .filter(ic -> Boolean.TRUE.equals(ic.getDeveloper()))
                .map(InvolvedCompany::getCompany)
                .toList();
    }

    @JsonProperty("publishers")
    public List<String> getPublishers() {
        if (involvedCompanies == null) return java.util.Collections.emptyList();
        return involvedCompanies.stream()
                .filter(ic -> Boolean.TRUE.equals(ic.getPublisher()))
                .map(InvolvedCompany::getCompany)
                .toList();
    }

    public String getSeriesName() {
        return (collection != null) ? collection.getName() : null;
    }

    @JsonProperty("versionHistory")
    public List<String> getVersionHistory() {
        if (asChildRelations == null) return null;
        return asChildRelations.stream().map(Game::getName).toList();
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
    public List<String> getVideos() {
        if (videos == null) return java.util.Collections.emptyList();
        return videos.stream().map(Video::getVideoId).distinct().toList();
    }

    @JsonProperty("websites")
    public List<String> getWebsites() {
        if (websites == null) return java.util.Collections.emptyList();
        return websites.stream().map(Website::getUrl).distinct().toList();
    }

    @JsonProperty("playerPerspectives")
    public List<String> getPlayerPerspectives() {
        if (playerPerspectives == null) return java.util.Collections.emptyList();
        return playerPerspectives.stream().map(PlayerPerspective::getName).distinct().toList();
    }

    @JsonProperty("gameEngines")
    public List<String> getGameEngines() {
        if (gameEngines == null) return java.util.Collections.emptyList();
        return gameEngines.stream().map(GameEngine::getName).distinct().toList();
    }

    @JsonProperty("artworks")
    public List<String> getArtworks() {
        if (artworks == null) return java.util.Collections.emptyList();
        return artworks.stream().filter(java.util.Objects::nonNull).map(Artwork::getImageId).distinct().toList();
    }

    @JsonProperty("screenshots")
    public List<String> getScreenshots() {
        if (screenshots == null) return java.util.Collections.emptyList();
        return screenshots.stream().filter(java.util.Objects::nonNull).map(Screenshot::getImageId).distinct().toList();
    }

    @JsonProperty("ageRatings")
    public List<java.util.Map<String, Object>> getAgeRatings() {
        if (ageRatings == null) return java.util.Collections.emptyList();
        return ageRatings.stream()
                .map(ar -> java.util.Map.<String, Object>of(
                        "category", ar.getCategory(),
                        "rating", ar.getRating()
                )).toList();
    }

    @JsonProperty("similarGamesData")
    public List<java.util.Map<String, Object>> getSimilarGamesData() {
        if (similarGames == null) return java.util.Collections.emptyList();
        return similarGames.stream()
                .filter(java.util.Objects::nonNull)
                .map(g -> {
                    java.util.Map<String, Object> map = new java.util.HashMap<>();
                    map.put("igdbId", g.getIgdbId());
                    map.put("name", g.getName());
                    if (g.getCover() != null) map.put("cover", g.getCover());
                    return map;
                })
                .toList();
    }
}
