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

@WebMvcTest(CollectionController.class)
@AutoConfigureMockMvc(addFilters = false)
class CollectionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CollectionService collectionService;

    @MockitoBean
    private JwtService jwtService;

    @Test
    void allCollections_ShouldReturnOk() throws Exception {
        Page<Collection> page = new PageImpl<>(Collections.emptyList());
        when(collectionService.allCollections(any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/v1/collections"))
                .andExpect(status().isOk());
    }

    @Test
    void findByName_ShouldReturnOk() throws Exception {
        when(collectionService.findCollectionByName("Mario")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/collections/search").param("name", "Mario"))
                .andExpect(status().isOk());
    }
}
