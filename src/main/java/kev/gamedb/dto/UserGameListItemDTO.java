package kev.gamedb.dto;

import kev.gamedb.Game;
import kev.gamedb.GameStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class UserGameListItemDTO {
    private Game game;
    private GameStatus status;
    private Double personalRating;
    private String review;
    private Instant lastUpdated;

    // Quest Journal v2 fields
    private Integer replayCount;
    private Instant startedAt;
    private Instant completedAt;
    private String priority;
}
