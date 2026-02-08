package kev.gamedb;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "genres")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Genre {
    @Id
    private ObjectId id;
    private Integer igdbId;
    private String name;
    private String slug;
    private String url;
}
