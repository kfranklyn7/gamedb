package kev.gamedb.dto;

import lombok.Data;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Data
public class GroupedListResponse {
    private String groupBy;
    private Map<String, List<UserGameListItemDTO>> groups = new LinkedHashMap<>();

    public GroupedListResponse(String groupBy) {
        this.groupBy = groupBy;
    }
}
