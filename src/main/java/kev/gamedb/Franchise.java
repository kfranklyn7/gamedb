package kev.gamedb;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "franchises")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Franchise {
    @Id
    private ObjectId id;
    @Field("igdbId")
    private Integer igdbId;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    private List<Game> games;
    private String name;
    private String slug;
    private String url;

}
