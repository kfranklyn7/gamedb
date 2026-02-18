package kev.gamedb;

import lombok.Data;
import java.util.List;

@Data
public class ListCriteria {
    private List<Integer> genres;
    private List<Integer> platforms;
    private List<String> gameModes;
    private String franchise;
    private String searchKeyword;
}
