package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Data
@Document(collection = "videos")
public class Video {
    @Id
    private Integer igdbId;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    private Game game;
    private String name;
    @org.springframework.data.mongodb.core.mapping.Field("video_id")
    private String videoId;
}
