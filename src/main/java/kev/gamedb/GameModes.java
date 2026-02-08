package kev.gamedb;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "game_modes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameModes {
    @Id
    private ObjectId id;
    @Field("igdbId")
    private Integer igdbId;
    private String name;
    private String slug;
    private String url;
}
