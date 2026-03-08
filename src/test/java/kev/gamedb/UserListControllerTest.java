package kev.gamedb;

import tools.jackson.databind.ObjectMapper;
import kev.gamedb.dto.UserListItemRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserListController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserListControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private UserListService userListService;
    @MockitoBean
    private JwtService jwtService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void addItem_ShouldReturn400WhenGameIdMissing() throws Exception {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setStatus(GameStatus.PLAYING);
        // gameId intentionally missing

        mockMvc.perform(post("/api/v1/user/list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void addItem_ShouldReturn400WhenRatingOutOfRange() throws Exception {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(472);
        request.setStatus(GameStatus.PLAYING);
        request.setPersonalRating(15.0);

        mockMvc.perform(post("/api/v1/user/list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void addItem_ShouldReturn400WhenRatingBelowRange() throws Exception {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(472);
        request.setStatus(GameStatus.PLAYING);
        request.setPersonalRating(0.0);

        mockMvc.perform(post("/api/v1/user/list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateItem_ShouldReturn400WhenGameIdMissing() throws Exception {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setPersonalRating(8.0);

        mockMvc.perform(put("/api/v1/user/list")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
