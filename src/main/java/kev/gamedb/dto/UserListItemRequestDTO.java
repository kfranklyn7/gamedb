package kev.gamedb.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import kev.gamedb.GameStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class UserListItemRequestDTO {
    @NotNull(message = "'gameId' is required")
    @Schema(description = "The IGDB ID of the game", example = "1942")
    private Integer gameId;
    
    @Schema(description = "The user's current status for the game", example = "PLAYING")
    private GameStatus status;
    
    @Schema(description = "The user's personal rating out of 10", example = "8.5")
    private Double personalRating;
    private String review;

    // Quest Journal v2 fields
    @Min(value = 0, message = "'replayCount' must be >= 0")
    @Schema(description = "Number of times the user has replayed the game", example = "2")
    private Integer replayCount;

    @Schema(description = "When the user started playing", example = "2024-01-15T00:00:00Z")
    private Instant startedAt;

    @Schema(description = "When the user completed the game", example = "2024-03-20T00:00:00Z")
    private Instant completedAt;

    @Pattern(regexp = "^(HIGH|MEDIUM|LOW)$", message = "'priority' must be HIGH, MEDIUM, or LOW")
    @Schema(description = "Backlog priority level", example = "HIGH")
    private String priority;
}
