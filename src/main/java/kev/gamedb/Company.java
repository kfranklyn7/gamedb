package kev.gamedb;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "companies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Company {
    @Id
    private ObjectId id;
    private Integer igdbId;
    private String description;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private List<Game> developed;
    private String name;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private List<Game> published;
    private String slug;
    @JsonProperty("developed")
    public List<String> getDeveloped(){
        try {
            if (developed == null) return null;
            return developed.stream().filter(java.util.Objects::nonNull).map(Game::getName).toList();
        } catch(Exception e){
            return java.util.Collections.singletonList("Data Resolution error");
        }
    }
    @JsonProperty("published")
    public List<String> getPublished(){
        try{
        if(published == null) return null;
        return published.stream().filter(java.util.Objects::nonNull).map(Game::getName).toList();} catch (Exception e) {
            return java.util.Collections.singletonList("Data Resolution error");
        }
    }
}
