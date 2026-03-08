package kev.gamedb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityReviewDTO {
    private String username;
    private Integer personalRating;
    private String review;
    private Instant lastUpdated;
}
