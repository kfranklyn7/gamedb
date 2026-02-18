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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private GameService gameService;

    @Test
    void allGames_ShouldReturnPageOfGames() {
        Pageable pageable = Pageable.unpaged();
        Page<Game> page = new PageImpl<>(Collections.singletonList(new Game()));
        when(gameRepository.findAll(pageable)).thenReturn(page);

        Page<Game> result = gameService.allGames(pageable);

        assertEquals(1, result.getTotalElements());
        verify(gameRepository, times(1)).findAll(pageable);
    }

    @Test
    void singleGame_ShouldReturnGameIfExists() {
        Game game = new Game();
        game.setIgdbId(123);
        when(gameRepository.findByigdbId(123)).thenReturn(Optional.of(game));

        Optional<Game> result = gameService.singleGame(123);

        assertTrue(result.isPresent());
        assertEquals(123, result.get().getIgdbId());
    }

    @Test
    void findByName_ShouldReturnListOfGames() {
        when(gameRepository.findByNameContainingIgnoreCase("Witch")).thenReturn(Collections.singletonList(new Game()));

        List<Game> result = gameService.findByName("Witch");

        assertFalse(result.isEmpty());
        verify(gameRepository, times(1)).findByNameContainingIgnoreCase("Witch");
    }
}
