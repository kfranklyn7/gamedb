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
    private Double personalRating; // 0.0-10.0
    private String review;
    private Instant lastUpdated;

    // Quest Journal v2 fields
    private Integer replayCount;     // how many times replayed
    private Instant startedAt;       // when the user started playing
    private Instant completedAt;     // when the user completed
    private String priority;         // HIGH, MEDIUM, LOW

    @JsonProperty("id")
    public String getIdString() {
        return id != null ? id.toHexString() : null;
    }
}
