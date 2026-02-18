package kev.gamedb;

import tools.jackson.databind.ObjectMapper;
import kev.gamedb.dto.GameSearchDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(GameController.class)
@AutoConfigureMockMvc(addFilters = false)
class GameControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GameService gameService;

    @MockitoBean
    private GameSearchService searchService;

    @MockitoBean
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void allGames_ShouldReturnPage() throws Exception {
        Page<Game> page = new PageImpl<>(Collections.emptyList());
        when(gameService.allGames(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/v1/games"))
                .andExpect(status().isOk());
    }

    @Test
    void getSingleGame_ShouldReturnGame() throws Exception {
        Game game = new Game();
        game.setIgdbId(123);
        when(gameService.singleGame(123)).thenReturn(Optional.of(game));

        mockMvc.perform(get("/api/v1/games/123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.igdbId").value(123));
    }

    @Test
    void searchAdvanced_ShouldReturnResults() throws Exception {
        GameSearchDTO criteria = new GameSearchDTO();
        criteria.setSearchTerm("Witch");
        when(searchService.searchGames(any(GameSearchDTO.class))).thenReturn(Collections.emptyList());

        mockMvc.perform(post("/api/v1/games/search-advanced")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(criteria)))
                .andExpect(status().isOk());
    }
}
