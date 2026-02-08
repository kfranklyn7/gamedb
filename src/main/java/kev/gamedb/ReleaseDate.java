package kev.gamedb;

import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.time.Instant;

@Document(collection = "release_dates")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReleaseDate {
    @Id
    private ObjectId id;
    private Instant date;
    private Integer igdbId;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    private Game game;
    private String human;
    private Integer m;
    private Integer y;
    private String status;
}
