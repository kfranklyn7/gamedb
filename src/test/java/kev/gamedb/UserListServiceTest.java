package kev.gamedb;

import kev.gamedb.dto.UserListItemRequestDTO;
import kev.gamedb.exception.InvalidRequestException;
import kev.gamedb.exception.ResourceAlreadyExistsException;
import kev.gamedb.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserListServiceTest {

    @Mock
    private UserGameListItemRepository itemRepository;
    @Mock
    private UserListRepository listRepository;
    @Mock
    private GameSearchService gameSearchService;
    @Mock
    private GameRepository gameRepository;

    @InjectMocks
    private UserListService userListService;

    private final String userId = "test@example.com";

    @BeforeEach
    void setUp() {
        // No shared setup needed — each test arranges its own mocks
    }

    // ─── addItem tests ───────────────────────────────────────────────

    @Test
    void addItem_ShouldSaveAndReturn() {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(472);
        request.setStatus(GameStatus.PLAYING);
        request.setPersonalRating(9);

        when(gameRepository.findByIgdbId(472)).thenReturn(Optional.of(new Game()));
        when(itemRepository.findByUserIdAndGameId(userId, 472)).thenReturn(Optional.empty());
        when(itemRepository.save(any(UserGameListItem.class))).thenAnswer(inv -> inv.getArgument(0));

        UserGameListItem result = userListService.addItem(userId, request);

        assertThat(result.getGameId()).isEqualTo(472);
        assertThat(result.getStatus()).isEqualTo(GameStatus.PLAYING);
        assertThat(result.getPersonalRating()).isEqualTo(9);
        verify(itemRepository).save(any(UserGameListItem.class));
    }

    @Test
    void addItem_ShouldThrow409WhenDuplicate() {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(472);
        request.setStatus(GameStatus.PLAYING);

        when(gameRepository.findByIgdbId(472)).thenReturn(Optional.of(new Game()));
        when(itemRepository.findByUserIdAndGameId(userId, 472)).thenReturn(Optional.of(new UserGameListItem()));

        assertThatThrownBy(() -> userListService.addItem(userId, request))
                .isInstanceOf(ResourceAlreadyExistsException.class)
                .hasMessageContaining("already in your list");
    }

    @Test
    void addItem_ShouldThrow404WhenGameNotInDb() {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(999999);
        request.setStatus(GameStatus.PLAYING);

        when(gameRepository.findByIgdbId(999999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userListService.addItem(userId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("does not exist");
    }

    @Test
    void addItem_ShouldThrow400WhenStatusMissing() {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(472);
        // status intentionally null

        assertThatThrownBy(() -> userListService.addItem(userId, request))
                .isInstanceOf(InvalidRequestException.class)
                .hasMessageContaining("status");
    }

    // ─── updateItem tests ────────────────────────────────────────────

    @Test
    void updateItem_ShouldUpdateFieldsAndSave() {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(472);
        request.setPersonalRating(8);
        request.setReview("Updated review");

        UserGameListItem existing = new UserGameListItem();
        existing.setGameId(472);
        existing.setStatus(GameStatus.PLAYING);
        existing.setPersonalRating(9);

        when(itemRepository.findByUserIdAndGameId(userId, 472)).thenReturn(Optional.of(existing));
        when(itemRepository.save(any(UserGameListItem.class))).thenAnswer(inv -> inv.getArgument(0));

        UserGameListItem result = userListService.updateItem(userId, request);

        assertThat(result.getPersonalRating()).isEqualTo(8);
        assertThat(result.getReview()).isEqualTo("Updated review");
        assertThat(result.getStatus()).isEqualTo(GameStatus.PLAYING); // unchanged
    }

    @Test
    void updateItem_ShouldThrow404WhenNotInList() {
        UserListItemRequestDTO request = new UserListItemRequestDTO();
        request.setGameId(999);

        when(itemRepository.findByUserIdAndGameId(userId, 999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userListService.updateItem(userId, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not in your list");
    }

    // ─── removeItem tests ────────────────────────────────────────────

    @Test
    void removeItem_ShouldDeleteWhenExists() {
        UserGameListItem item = new UserGameListItem();
        when(itemRepository.findByUserIdAndGameId(userId, 472)).thenReturn(Optional.of(item));

        userListService.removeItem(userId, 472);

        verify(itemRepository).delete(item);
    }

    @Test
    void removeItem_ShouldThrow404WhenNotInList() {
        when(itemRepository.findByUserIdAndGameId(userId, 999)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userListService.removeItem(userId, 999))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    // ─── patchItemStatus tests ───────────────────────────────────────

    @Test
    void patchStatus_ShouldUpdateStatusOnly() {
        UserGameListItem item = new UserGameListItem();
        item.setGameId(472);
        item.setStatus(GameStatus.PLAYING);
        item.setPersonalRating(9);

        when(itemRepository.findByUserIdAndGameId(userId, 472)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(UserGameListItem.class))).thenAnswer(inv -> inv.getArgument(0));

        UserGameListItem result = userListService.patchItemStatus(userId, 472, GameStatus.COMPLETED);

        assertThat(result.getStatus()).isEqualTo(GameStatus.COMPLETED);
        assertThat(result.getPersonalRating()).isEqualTo(9); // unchanged
    }
}
