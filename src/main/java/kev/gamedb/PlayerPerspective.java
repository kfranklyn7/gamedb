package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "playerPerspectives")
public class PlayerPerspective {
    @Id
    private String id;
    @Field("igdbId")
    private Long igdbId;
    private String name;
    private String slug;
}
