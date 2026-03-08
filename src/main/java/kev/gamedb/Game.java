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
    @JsonIgnore
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
    @JsonIgnore
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

    @com.fasterxml.jackson.annotation.JsonIgnore
    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Platform> platforms;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Screenshot> screenshots;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({ "involved_companies", "similarGames", "themes", "genres", "platforms", "artworks",
            "screenshots", "gameModes", "franchises", "franchise", "dlcs", "expansions", "remakes", "remasters" })
    @Field("similar_games")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> similarGames;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({ "involved_companies", "similarGames", "themes", "genres", "platforms", "artworks",
            "screenshots", "gameModes", "franchises", "franchise", "dlcs", "expansions", "remakes", "remasters" })
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> dlcs;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({ "involved_companies", "similarGames", "themes", "genres", "platforms", "artworks",
            "screenshots", "gameModes", "franchises", "franchise", "dlcs", "expansions", "remakes", "remasters" })
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> expansions;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({ "involved_companies", "similarGames", "themes", "genres", "platforms", "artworks",
            "screenshots", "gameModes", "franchises", "franchise", "dlcs", "expansions", "remakes", "remasters" })
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> remakes;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnoreProperties({ "involved_companies", "similarGames", "themes", "genres", "platforms", "artworks",
            "screenshots", "gameModes", "franchises", "franchise", "dlcs", "expansions", "remakes", "remasters" })
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Game> remasters;


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
    private Instant releaseDate;

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
    @Field("community_rating")
    private Double communityRating;
    @Field("community_rating_count")
    private Integer communityRatingCount;
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

    @Field("language_supports")
    @JsonIgnore
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<Integer> languageSupports;

    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    @Field("multiplayer_modes")
    @lombok.Getter(lombok.AccessLevel.NONE)
    private List<MultiplayerMode> multiplayerModes;

    @Field("version_title")
    private String versionTitle;

    private String franchiseName;
    private String seriesName;

    @Field("genreObjects")
    private List<Genre> genreObjects;
    @Field("platformObjects")
    private List<Platform> platformObjects;
    @Field("themeObjects")
    private List<Theme> themeObjects;
    @Field("coverObject")
    private Cover coverObject;
    @Field("involvedCompanyObjects")
    private List<InvolvedCompany> involvedCompanyObjects;

    @JsonProperty("genreNames")
    public List<String> getGenreNames() {
        List<Genre> source = (genreObjects != null) ? genreObjects : genres;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(g -> {
                        try {
                            return g.getName();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("franchiseNames")
    public List<String> getFranchiseNames() {
        if (franchises == null)
            return java.util.Collections.emptyList();
        try {
            return franchises.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(f -> {
                        try {
                            return f.getName();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("gameModes")
    public List<String> getGameModes() {
        if (gameModes == null)
            return java.util.Collections.emptyList();
        try {
            return gameModes.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(gm -> {
                        try {
                            return gm.getName();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("themes")
    public List<String> getThemes() {
        List<Theme> source = (themeObjects != null) ? themeObjects : themes;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(t -> {
                        try {
                            return t.getName();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("platforms")
    public List<String> getPlatforms() {
        List<Platform> source = (platformObjects != null) ? platformObjects : platforms;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(p -> {
                        try {
                            return p.getName();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("platformData")
    public List<java.util.Map<String, Object>> getPlatformData() {
        List<Platform> source = (platformObjects != null) ? platformObjects : platforms;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(p -> {
                        try {
                            java.util.Map<String, Object> map = new java.util.HashMap<>();
                            map.put("id", p.getIgdbId());
                            map.put("name", p.getName());
                            map.put("logoUrl", p.getPlatformLogoUrl());
                            map.put("family", p.getPlatformFamily());
                            return map;
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("cover")
    public String getCover() {
        if (coverObject != null) {
            try {
                return coverObject.getUrl();
            } catch (Exception e) {
            }
        }
        if (cover == null)
            return null;
        try {
            return cover.getUrl();
        } catch (Exception e) {
            return null;
        }
    }

    @JsonProperty("involved_companies")
    public List<String> getInvolvedCompanies() {
        List<InvolvedCompany> source = (involvedCompanyObjects != null) ? involvedCompanyObjects : involvedCompanies;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(ic -> {
                        try {
                            return ic.getCompany();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("developers")
    public List<java.util.Map<String, Object>> getDevelopers() {
        List<InvolvedCompany> source = (involvedCompanyObjects != null) ? involvedCompanyObjects : involvedCompanies;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(ic -> ic != null && Boolean.TRUE.equals(ic.getDeveloper()))
                    .map(ic -> {
                        try {
                            java.util.Map<String, Object> map = new java.util.HashMap<>();
                            map.put("id", ic.getCompanyId());
                            map.put("name", ic.getCompany());
                            return map;
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(m -> m != null && m.get("id") != null && m.get("name") != null).toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("seriesName")
    public String getSeriesName() {
        if (collection == null)
            return null;
        try {
            return collection.getName();
        } catch (Exception e) {
            return null;
        }
    }

    @JsonProperty("videos")
    public List<String> getVideos() {
        if (videos == null)
            return java.util.Collections.emptyList();
        try {
            return videos.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(v -> {
                        try {
                            return v.getVideoId();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("websites")
    public List<String> getWebsites() {
        if (websites == null)
            return java.util.Collections.emptyList();
        try {
            return websites.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(w -> {
                        try {
                            return w.getUrl();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("artworks")
    public List<String> getArtworks() {
        if (artworks == null)
            return java.util.Collections.emptyList();
        try {
            return artworks.stream().filter(java.util.Objects::nonNull)
                    .map(a -> {
                        try {
                            return a.getImageId();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("screenshots")
    public List<String> getScreenshots() {
        if (screenshots == null)
            return java.util.Collections.emptyList();
        try {
            return screenshots.stream().filter(java.util.Objects::nonNull)
                    .map(s -> {
                        try {
                            return s.getImageId();
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(java.util.Objects::nonNull).distinct().toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("franchise")
    public String getFranchise() {
        if (franchiseName != null)
            return franchiseName;
        if (franchise == null)
            return null;
        try {
            return franchise.getName();
        } catch (Exception e) {
            return null;
        }
    }

    @JsonProperty("publishers")
    public List<java.util.Map<String, Object>> getPublishers() {
        List<InvolvedCompany> source = (involvedCompanyObjects != null) ? involvedCompanyObjects : involvedCompanies;
        if (source == null)
            return java.util.Collections.emptyList();
        try {
            return source.stream()
                    .filter(ic -> ic != null && Boolean.TRUE.equals(ic.getPublisher()))
                    .map(ic -> {
                        try {
                            java.util.Map<String, Object> map = new java.util.HashMap<>();
                            map.put("id", ic.getCompanyId());
                            map.put("name", ic.getCompany());
                            return map;
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(m -> m != null && m.get("id") != null && m.get("name") != null).toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }

    @JsonProperty("similarGames")
    public List<java.util.Map<String, Object>> getSimilarGamesData() {
        return extractRelatedGames(similarGames);
    }

    @JsonProperty("dlcs")
    public List<java.util.Map<String, Object>> getDlcsData() {
        return extractRelatedGames(dlcs);
    }

    @JsonProperty("expansions")
    public List<java.util.Map<String, Object>> getExpansionsData() {
        return extractRelatedGames(expansions);
    }

    @JsonProperty("remakes")
    public List<java.util.Map<String, Object>> getRemakesData() {
        return extractRelatedGames(remakes);
    }

    @JsonProperty("remasters")
    public List<java.util.Map<String, Object>> getRemastersData() {
        return extractRelatedGames(remasters);
    }

    private List<java.util.Map<String, Object>> extractRelatedGames(List<Game> sourceList) {
        if (sourceList == null)
            return java.util.Collections.emptyList();
        try {
            return sourceList.stream()
                    .filter(java.util.Objects::nonNull)
                    .map(g -> {
                        try {
                            java.util.Map<String, Object> map = new java.util.HashMap<>();
                            map.put("igdbId", g.getIgdbId());
                            map.put("name", g.getName());
                            map.put("cover", g.getCover());
                            return map;
                        } catch (Exception e) {
                            return null;
                        }
                    })
                    .filter(m -> m != null && m.get("igdbId") != null && m.get("name") != null).toList();
        } catch (Exception e) {
            return java.util.Collections.emptyList();
        }
    }
}
