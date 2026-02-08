package kev.gamedb;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import java.util.List;

@Document(collection = "collections")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Collection {
    @Id
    @JsonIgnore
    private ObjectId id;


    @DocumentReference(lazy = true, lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore // 🛑 Stops recursion back to games
    private List<Game> games;

    private String name;
    private String slug;
    private String url;
}