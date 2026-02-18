package kev.gamedb;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "user_lists")
public class UserList {
    @Id
    private ObjectId id;

    private String userId;
    private String name;
    private boolean isDefault;
    
    // For manual lists
    private List<Integer> gameIds;

    // For dynamic lists
    private ListCriteria criteria;

    @JsonProperty("id")
    public String getIdString() {
        return id != null ? id.toHexString() : null;
    }
}
