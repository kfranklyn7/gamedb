package kev.gamedb.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String username;
    private Map<String, Long> stats; // e.g., "BACKLOG": 15, "COMPLETED": 120
    private List<UserGameListItemDTO> recentItems;
    private Map<String, String> preferences;
}
