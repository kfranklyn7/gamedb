package kev.gamedb;

import kev.gamedb.dto.UserListItemRequestDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user/list")
public class UserListController {

    private final UserListService userListService;

    public UserListController(UserListService userListService) {
        this.userListService = userListService;
    }

    // ─── Add a game to your list (409 if already exists) ──────────────
    @PostMapping
    public ResponseEntity<?> addItem(Authentication authentication, @RequestBody UserListItemRequestDTO request) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        return ResponseEntity.status(201).body(userListService.addItem(userId, request));
    }

    // ─── Update an existing game in your list ────────────────────────
    @PutMapping
    public ResponseEntity<?> updateItem(Authentication authentication, @RequestBody UserListItemRequestDTO request) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        return ResponseEntity.ok(userListService.updateItem(userId, request));
    }

    // ─── Enhancement 1: Delete a game from your list ─────────────────
    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeItem(Authentication authentication, @PathVariable Integer gameId) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        userListService.removeItem(userId, gameId);
        return ResponseEntity.noContent().build();
    }

    // ─── Enhancement 2: PATCH status only ────────────────────────────
    @PatchMapping("/{gameId}")
    public ResponseEntity<?> patchItemStatus(Authentication authentication,
                                              @PathVariable Integer gameId,
                                              @RequestBody Map<String, String> body) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        String statusStr = body.get("status");
        if (statusStr == null) return ResponseEntity.badRequest().body("Missing 'status' field");

        GameStatus newStatus;
        try {
            newStatus = GameStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: '" + statusStr + "'. Valid values: " + java.util.Arrays.toString(GameStatus.values()));
        }
        return ResponseEntity.ok(userListService.patchItemStatus(userId, gameId, newStatus));
    }

    // ─── Enhancement 3: Delete a custom list ─────────────────────────
    @DeleteMapping("/custom/{listId}")
    public ResponseEntity<?> deleteCustomList(Authentication authentication, @PathVariable String listId) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        userListService.deleteCustomList(userId, listId);
        return ResponseEntity.noContent().build();
    }

    // ─── Enhancement 4 & 5: Get list content (paginated + sorted) ───
    @GetMapping("/{listIdOrName}")
    public ResponseEntity<?> getListContent(Authentication authentication,
                                             @PathVariable String listIdOrName,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size,
                                             @RequestParam(defaultValue = "lastUpdated") String sortBy,
                                             @RequestParam(defaultValue = "desc") String sortDirection) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        return ResponseEntity.ok(userListService.getListContent(userId, listIdOrName, page, size, sortBy, sortDirection));
    }

    // ─── Enhancement 6: Grouped list view ────────────────────────────
    @GetMapping("/{listIdOrName}/grouped")
    public ResponseEntity<?> getGroupedList(Authentication authentication,
                                             @PathVariable String listIdOrName,
                                             @RequestParam(defaultValue = "genre") String groupBy) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        return ResponseEntity.ok(userListService.getGroupedListContent(userId, listIdOrName, groupBy));
    }

    // ─── Get metadata for all custom lists ───────────────────────────
    @GetMapping("/lists")
    public ResponseEntity<?> getMyLists(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        return ResponseEntity.ok(userListService.getUserLists(userId));
    }

    // ─── Create a custom/dynamic list ────────────────────────────────
    @PostMapping("/custom")
    public ResponseEntity<?> createCustomList(Authentication authentication, @RequestParam String name, @RequestBody ListCriteria criteria) {
        if (authentication == null) return ResponseEntity.status(401).body("Authentication required");
        String userId = authentication.getName();
        return ResponseEntity.ok(userListService.createCustomList(userId, name, criteria));
    }
}
