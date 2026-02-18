package kev.gamedb;

import kev.gamedb.dto.GameSearchDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mongodb.MongoDBContainer;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "spring.main.allow-bean-definition-overriding=true" //
)
@AutoConfigureRestTestClient
@Testcontainers
@ActiveProfiles("test")
public class GameSearchIntegrationTest {

    @Container
    @ServiceConnection // This is the key fix
    static MongoDBContainer mongodb = new MongoDBContainer("mongo:latest")
            .withStartupAttempts(3); // Give it more chances if Docker is slow

    @Autowired
    private GameSearchService searchService;


    @Autowired
    private MongoTemplate mongoTemplate;

    @BeforeEach
    void setup() {
        mongoTemplate.remove(new org.springframework.data.mongodb.core.query.Query(), Game.class);
        
        // Ensure text index exists
        mongoTemplate.getCollection("games").createIndex(new org.bson.Document("name", "text"));

        // Use a document to ensure fields like total_rating and first_release_date are set
        org.bson.Document gameDoc = new org.bson.Document()
                .append("name", "The Witcher 3")
                .append("first_release_date", java.time.Instant.now())
                .append("total_rating", 95.0)
                .append("genres", java.util.List.of("RPG"))
                .append("_class", Game.class.getName());

        mongoTemplate.getCollection("games").insertOne(gameDoc);
    }

    @Test
    void searchByPartialNameReturnsCorrectResults() {
        GameSearchDTO dto = new GameSearchDTO();
        dto.setSearchTerm("Witcher");

        List<Game> results = searchService.searchGames(dto);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getName()).isEqualTo("The Witcher 3");
    }
}