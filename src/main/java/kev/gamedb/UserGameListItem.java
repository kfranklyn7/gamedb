package kev.gamedb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "user_game_list_items")
@CompoundIndex(name = "user_game_idx", def = "{'userId': 1, 'gameId': 1}", unique = true)
public class UserGameListItem {
    @Id
    private ObjectId id;

    private String userId;
    private Integer gameId;
    private GameStatus status;
    private Integer personalRating; // 1-10
    private String review;
    private Instant lastUpdated;

    @JsonProperty("id")
    public String getIdString() {
        return id != null ? id.toHexString() : null;
    }
}
