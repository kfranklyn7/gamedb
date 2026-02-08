package kev.gamedb;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "platforms")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Platform {
    @Id
    private ObjectId id;
    private Integer igdbId;
    private Integer generation;
    private String name;
    private String slug;
    private String summary;
    private String url;
}
