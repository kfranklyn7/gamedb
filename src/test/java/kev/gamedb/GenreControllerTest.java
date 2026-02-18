package kev.gamedb;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(GenreController.class)
@AutoConfigureMockMvc(addFilters = false)
class GenreControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private GenreService genreService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void allGenres_ShouldReturnOk() throws Exception {
        Page<Genre> page = new PageImpl<>(Collections.emptyList());
        when(genreService.allGenres(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/v1/genres"))
                .andExpect(status().isOk());
    }

    @Test
    void findByName_ShouldReturnOk() throws Exception {
        when(genreService.findByName("RPG")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/genres/search").param("name", "RPG"))
                .andExpect(status().isOk());
    }
}
