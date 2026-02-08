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
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "covers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cover {
    @Id
    private ObjectId id;
    @Field("igdbId")
    private Integer igdbId;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private Game game;
    private String imageId;
    private Integer width;
    private Integer height;
    private String url;
    @JsonProperty("game")
    public String getGame(){
        return game.getName();
    }
}
