package kev.gamedb;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "screenshots")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Screenshot {
    @Id
    private ObjectId id;
    private Integer igdbId;
    private Integer height;
    private Integer width;
    @org.springframework.data.mongodb.core.mapping.Field("image_id")
    private String imageId;
    private String url;
    @DocumentReference
    private Game game;
}
