package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "websites")
public class Website {
    @Id
    private String id;
    @Field("igdbId")
    private Long igdbId;
    private Integer category;
    private Boolean trusted;
    private String url;
}
