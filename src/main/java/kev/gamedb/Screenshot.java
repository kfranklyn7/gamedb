package kev.gamedb;

import jakarta.persistence.Id;
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
    private String url;
    @DocumentReference
    private Game game;
}
