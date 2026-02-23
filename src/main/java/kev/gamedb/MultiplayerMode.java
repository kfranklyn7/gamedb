package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "multiplayerModes")
public class MultiplayerMode {
    @Id
    private String id;
    @Field("igdbId")
    private Long igdbId;
    private Boolean campaigncoop;
    private Boolean dropin;
    private Boolean lancoop;
    private Boolean offlinecoop;
    private Boolean onlinecoop;
    private Boolean splitscreen;
    private Integer onlinecoopmax;
    private Integer offlinecoopmax;
}
