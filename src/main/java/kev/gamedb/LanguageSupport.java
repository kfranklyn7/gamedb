package kev.gamedb;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Document(collection = "languageSupports")
public class LanguageSupport {
    @Id
    private String id;
    @Field("igdbId")
    private Long igdbId;
    private Integer language;
    @Field("language_support_type")
    private Integer languageSupportType;
}
