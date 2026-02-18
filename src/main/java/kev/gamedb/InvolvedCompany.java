package kev.gamedb;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "involved_companies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvolvedCompany {
    @Id
    private ObjectId id;
    private Integer igdbId;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private Company company;
    @DocumentReference(lazy = true,lookup = "{ 'igdbId' : ?#{#target} }")
    @JsonIgnore
    private Game game;
    private Boolean developer;
    private Boolean porting;
    private Boolean publisher;
    private Boolean supporting;
    @JsonProperty("game")
    public String getGame(){
        return game.getName();
    }
    @JsonProperty("company")
    public String getCompany(){
        return (company != null) ? company.getName() : null;
    }
}
