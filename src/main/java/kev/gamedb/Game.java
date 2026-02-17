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
//    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
//    @Field("release_dates")
//    @JsonIgnore
//    private List<ReleaseDate> releaseDates;
//    Release Dates needs a better implementation so I am currently shelving it, releaseDate is sufficient as it stands
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
    private Instant releaseDate;

    @JsonProperty("genreNames")
    public List<String> getGenreNames() {
        if (genres == null) return null;
        return genres.stream().map(Genre::getName).toList();
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
        return franchises.stream().map(Franchise::getName).toList();
    }

    @JsonProperty("franchiseName")
    public String getFranchise() {
        return franchise.getName();
    }

    @JsonProperty("gameModes")
    public List<String> getGameModes() {
        return gameModes.stream().map(GameModes::getName).toList();
    }

    @JsonProperty("themes")
    public List<String> getThemes() {
        return themes.stream().map(Theme::getName).toList();
    }

    @JsonProperty("platforms")
    public List<String> getPlatforms() {
        return platforms.stream().map(Platform::getName).toList();
    }

    @JsonProperty("cover")
    public String getCover() {
        return cover.getUrl();
    }

    @JsonProperty("involved_companies")
    public List<String> getInvolvedCompanies() {
        return involvedCompanies.stream().map(InvolvedCompany::getCompany).toList();
    }

//    @JsonProperty("keywords")
//    public List<String> getKeywords() {
//        return keywords.stream().map(Keyword::getName).toList();
//    }

//    @JsonProperty("release_dates")
//    public List<String> getReleaseDates(){
//        return releaseDates.stream().map(ReleaseDate::getHuman).toList();
//    }
    @JsonProperty("seriesName")
    public String getSeriesName() {
        return (collection != null) ? collection.getName() : null;
    }

    @JsonProperty("versionHistory")
    public List<String> getVersionHistory() {
        if (asChildRelations == null) return null;
        return asChildRelations.stream().map(Game::getName).toList();
    }


}
