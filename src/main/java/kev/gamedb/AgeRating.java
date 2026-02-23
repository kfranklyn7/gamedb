package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "ageRatings")
public class AgeRating {
    @Id
    private String id;
    @Field("igdbId")
    private Long igdbId;
    private Integer category;
    private Integer rating;
}
