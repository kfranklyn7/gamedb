package kev.gamedb;

import kev.gamedb.dto.UserProfileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserListService userListService;

    @GetMapping("/{username}")
    public ResponseEntity<UserProfileDTO> getUserProfile(@PathVariable String username) {
        return ResponseEntity.ok(userListService.getUserProfile(username));
    }

    @GetMapping
    public ResponseEntity<?> getCommunityUsers() {
        return ResponseEntity.ok(userListService.getCommunityUsers());
    }

    @GetMapping("/{username}/list/{listIdOrName}")
    public ResponseEntity<?> getPublicListContent(
            @PathVariable String username,
            @PathVariable String listIdOrName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "lastUpdated") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {
        return ResponseEntity.ok(userListService.getPublicListContent(username, listIdOrName, page, size, sortBy, sortDirection));
    }

    @PutMapping("/{username}/preferences")
    public ResponseEntity<Void> updatePreferences(@PathVariable String username,
            @RequestBody Map<String, String> preferences) {
        userListService.updateUserPreferences(username, preferences);
        return ResponseEntity.noContent().build();
    }
}
