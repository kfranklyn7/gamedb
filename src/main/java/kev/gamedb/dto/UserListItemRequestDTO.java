package kev.gamedb.dto;

import kev.gamedb.GameStatus;
import lombok.Data;

@Data
public class UserListItemRequestDTO {
    private Integer gameId;
    private GameStatus status;
    private Integer personalRating;
    private String review;
}
