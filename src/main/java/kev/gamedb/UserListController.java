package kev.gamedb;

import jakarta.validation.Valid;
import kev.gamedb.dto.UserListItemRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/user/list")
public class UserListController {
    @Autowired
    private UserListService userListService;

    @PostMapping
    public ResponseEntity<?> addItem(Authentication authentication, @Valid @RequestBody UserListItemRequestDTO request) {
        return ResponseEntity.status(201).body(userListService.addItem(authentication.getName(), request));
    }

    @PutMapping
    public ResponseEntity<?> updateItem(Authentication authentication, @Valid @RequestBody UserListItemRequestDTO request) {
        return ResponseEntity.ok(userListService.updateItem(authentication.getName(), request));
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<?> removeItem(Authentication authentication, @PathVariable Integer gameId) {
        userListService.removeItem(authentication.getName(), gameId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{gameId}")
    public ResponseEntity<?> patchItemStatus(Authentication authentication,
                                              @PathVariable Integer gameId,
                                              @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null) return ResponseEntity.badRequest().body("Missing 'status' field");

        GameStatus newStatus;
        try {
            newStatus = GameStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: '" + statusStr + "'. Valid values: " + java.util.Arrays.toString(GameStatus.values()));
        }
        return ResponseEntity.ok(userListService.patchItemStatus(authentication.getName(), gameId, newStatus));
    }

    @DeleteMapping("/custom/{listId}")
    public ResponseEntity<?> deleteCustomList(Authentication authentication, @PathVariable String listId) {
        userListService.deleteCustomList(authentication.getName(), listId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{listIdOrName}")
    public ResponseEntity<?> getListContent(Authentication authentication,
                                             @PathVariable String listIdOrName,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "20") int size,
                                             @RequestParam(defaultValue = "lastUpdated") String sortBy,
                                             @RequestParam(defaultValue = "desc") String sortDirection) {
        return ResponseEntity.ok(userListService.getListContent(authentication.getName(), listIdOrName, page, size, sortBy, sortDirection));
    }

    @GetMapping("/{listIdOrName}/grouped")
    public ResponseEntity<?> getGroupedList(Authentication authentication,
                                             @PathVariable String listIdOrName,
                                             @RequestParam(defaultValue = "genre") String groupBy) {
        return ResponseEntity.ok(userListService.getGroupedListContent(authentication.getName(), listIdOrName, groupBy));
    }

    @GetMapping("/lists")
    public ResponseEntity<?> getMyLists(Authentication authentication) {
        return ResponseEntity.ok(userListService.getUserLists(authentication.getName()));
    }

    @PostMapping("/custom")
    public ResponseEntity<?> createCustomList(Authentication authentication, @RequestParam String name, @RequestBody ListCriteria criteria) {
        return ResponseEntity.ok(userListService.createCustomList(authentication.getName(), name, criteria));
    }
}
