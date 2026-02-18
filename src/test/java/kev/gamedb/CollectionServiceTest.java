package kev.gamedb;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollectionServiceTest {

    @Mock
    private CollectionRepository collectionRepository;

    @InjectMocks
    private CollectionService collectionService;

    @Test
    void allCollections_ShouldReturnPage() {
        Pageable pageable = Pageable.unpaged();
        Page<Collection> page = new PageImpl<>(Collections.emptyList());
        when(collectionRepository.findAll(pageable)).thenReturn(page);

        Page<Collection> result = collectionService.allCollections(pageable);

        assertEquals(0, result.getTotalElements());
        verify(collectionRepository, times(1)).findAll(pageable);
    }

    @Test
    void findCollectionByName_ShouldReturnList() {
        when(collectionRepository.findByNameContainingIgnoreCase("Mario")).thenReturn(Collections.singletonList(new Collection()));

        List<Collection> result = collectionService.findCollectionByName("Mario");

        assertFalse(result.isEmpty());
        verify(collectionRepository, times(1)).findByNameContainingIgnoreCase("Mario");
    }
}
