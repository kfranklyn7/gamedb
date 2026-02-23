package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "gameEngines")
public class GameEngine {
    @Id
    private String id;
    @Field("igdbId")
    private Long igdbId;
    private String name;
    private String slug;
}
