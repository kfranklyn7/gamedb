package kev.gamedb;

import kev.gamedb.dto.GameSearchDTO;
import kev.gamedb.dto.GroupedListResponse;
import kev.gamedb.dto.PaginatedListResponse;
import kev.gamedb.dto.UserGameListItemDTO;
import kev.gamedb.dto.UserListItemRequestDTO;
import kev.gamedb.exception.InvalidRequestException;
import kev.gamedb.exception.ResourceAlreadyExistsException;
import kev.gamedb.exception.ResourceNotFoundException;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserListService {
    private final UserGameListItemRepository itemRepository;
    private final UserListRepository listRepository;
    private final GameSearchService gameSearchService;
    private final GameRepository gameRepository;

    public UserListService(UserGameListItemRepository itemRepository,
                           UserListRepository listRepository,
                           GameSearchService gameSearchService,
                           GameRepository gameRepository) {
        this.itemRepository = itemRepository;
        this.listRepository = listRepository;
        this.gameSearchService = gameSearchService;
        this.gameRepository = gameRepository;
    }

    // ─── Add a game to your list ─────────────────────────────────────

    public UserGameListItem addItem(String userId, UserListItemRequestDTO request) {
        // Validate required fields
        if (request.getGameId() == null) {
            throw new InvalidRequestException("'gameId' is required");
        }
        if (request.getStatus() == null) {
            throw new InvalidRequestException("'status' is required");
        }

        // Validate personalRating range
        if (request.getPersonalRating() != null && (request.getPersonalRating() < 1 || request.getPersonalRating() > 10)) {
            throw new InvalidRequestException("'personalRating' must be between 1 and 10");
        }

        // Check if game exists in the database
        if (gameRepository.findByIgdbId(request.getGameId()).isEmpty()) {
            throw new ResourceNotFoundException("Game with ID " + request.getGameId() + " does not exist in the database");
        }

        // Check if game already in user's list
        if (itemRepository.findByUserIdAndGameId(userId, request.getGameId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Game with ID " + request.getGameId() + " is already in your list. Use PATCH to update it.");
        }

        UserGameListItem item = new UserGameListItem();
        item.setUserId(userId);
        item.setGameId(request.getGameId());
        item.setStatus(request.getStatus());
        item.setPersonalRating(request.getPersonalRating());
        item.setReview(request.getReview());
        item.setLastUpdated(Instant.now());

        return itemRepository.save(item);
    }

    // ─── Update an existing game in your list ─────────────────────────

    public UserGameListItem updateItem(String userId, UserListItemRequestDTO request) {
        if (request.getGameId() == null) {
            throw new InvalidRequestException("'gameId' is required");
        }

        // Validate personalRating range
        if (request.getPersonalRating() != null && (request.getPersonalRating() < 1 || request.getPersonalRating() > 10)) {
            throw new InvalidRequestException("'personalRating' must be between 1 and 10");
        }

        UserGameListItem item = itemRepository.findByUserIdAndGameId(userId, request.getGameId())
                .orElseThrow(() -> new ResourceNotFoundException("Game with ID " + request.getGameId() + " is not in your list"));

        if (request.getStatus() != null) item.setStatus(request.getStatus());
        if (request.getPersonalRating() != null) item.setPersonalRating(request.getPersonalRating());
        if (request.getReview() != null) item.setReview(request.getReview());
        item.setLastUpdated(Instant.now());

        return itemRepository.save(item);
    }

    // ─── Delete Game from List ────────────────────────────────────────

    public void removeItem(String userId, Integer gameId) {
        UserGameListItem item = itemRepository.findByUserIdAndGameId(userId, gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game with ID " + gameId + " is not in your list"));
        itemRepository.delete(item);
    }

    // ─── Enhancement 2: PATCH Status ─────────────────────────────────

    public UserGameListItem patchItemStatus(String userId, Integer gameId, GameStatus newStatus) {
        UserGameListItem item = itemRepository.findByUserIdAndGameId(userId, gameId)
                .orElseThrow(() -> new ResourceNotFoundException("Game with ID " + gameId + " is not in your list"));
        item.setStatus(newStatus);
        item.setLastUpdated(Instant.now());
        return itemRepository.save(item);
    }

    // ─── Enhancement 3: Delete Custom List ───────────────────────────

    public void deleteCustomList(String userId, String listId) {
        ObjectId objectId;
        try {
            objectId = new ObjectId(listId);
        } catch (IllegalArgumentException e) {
            throw new InvalidRequestException("Invalid list ID format: '" + listId + "'");
        }

        UserList list = listRepository.findByIdAndUserId(objectId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Custom list not found with ID '" + listId + "'"));

        if (list.isDefault()) {
            throw new InvalidRequestException("Cannot delete a default list");
        }

        listRepository.delete(list);
    }

    // ─── Enhancement 4 & 5: Get List Content (Paginated + Sorted) ───

    public PaginatedListResponse<UserGameListItemDTO> getListContent(
            String userId, String listIdOrName,
            int page, int size,
            String sortBy, String sortDirection) {

        // Handle "ALL" list
        if ("ALL".equalsIgnoreCase(listIdOrName)) {
            return getPaginatedItems(userId, null, page, size, sortBy, sortDirection);
        }

        // Handle default lists by status
        for (GameStatus status : GameStatus.values()) {
            if (status.name().equalsIgnoreCase(listIdOrName)) {
                return getPaginatedItems(userId, status, page, size, sortBy, sortDirection);
            }
        }

        // Handle custom lists (no pagination from DB, done in-memory)
        Optional<UserList> customList = listRepository.findByUserId(userId).stream()
                .filter(l -> l.getId().toHexString().equals(listIdOrName) || l.getName().equalsIgnoreCase(listIdOrName))
                .findFirst();

        if (customList.isPresent()) {
            UserList list = customList.get();
            List<UserGameListItemDTO> allItems;
            if (list.getCriteria() != null) {
                GameSearchDTO search = mapCriteriaToSearch(list.getCriteria());
                search.setPage(page);
                search.setSize(size);
                List<Game> games = gameSearchService.searchGames(search);
                allItems = wrapGamesWithUserInfo(userId, games);
            } else if (list.getGameIds() != null) {
                List<UserGameListItem> items = itemRepository.findByUserId(userId).stream()
                        .filter(i -> list.getGameIds().contains(i.getGameId()))
                        .toList();
                allItems = enrichItems(items);
            } else {
                allItems = new ArrayList<>();
            }

            // Sort
            sortItems(allItems, sortBy, sortDirection);

            // Paginate in-memory for manual lists
            long totalItems = allItems.size();
            int fromIndex = Math.min(page * size, allItems.size());
            int toIndex = Math.min(fromIndex + size, allItems.size());
            List<UserGameListItemDTO> pageItems = allItems.subList(fromIndex, toIndex);

            return new PaginatedListResponse<>(pageItems, page, size, totalItems);
        }

        return new PaginatedListResponse<>(new ArrayList<>(), page, size, 0);
    }

    private PaginatedListResponse<UserGameListItemDTO> getPaginatedItems(
            String userId, GameStatus status,
            int page, int size,
            String sortBy, String sortDirection) {

        // For DB-sortable fields (lastUpdated), use Pageable
        Sort sort = buildSort(sortBy, sortDirection);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<UserGameListItem> itemPage;
        if (status == null) {
            itemPage = itemRepository.findByUserId(userId, pageable);
        } else {
            itemPage = itemRepository.findByUserIdAndStatus(userId, status, pageable);
        }

        List<UserGameListItemDTO> enriched = enrichItems(itemPage.getContent());

        // If sorting by game property, sort enriched items in-memory
        if (isGameProperty(sortBy)) {
            sortItems(enriched, sortBy, sortDirection);
        }

        return new PaginatedListResponse<>(enriched, page, size, itemPage.getTotalElements());
    }

    // ─── Enhancement 6: Grouping ─────────────────────────────────────

    public GroupedListResponse getGroupedListContent(String userId, String listIdOrName, String groupBy) {
        // Get ALL items (no pagination for grouped view)
        List<UserGameListItemDTO> allItems;

        if ("ALL".equalsIgnoreCase(listIdOrName)) {
            allItems = enrichItems(itemRepository.findByUserId(userId));
        } else {
            // Check for status-based list
            GameStatus matchedStatus = null;
            for (GameStatus status : GameStatus.values()) {
                if (status.name().equalsIgnoreCase(listIdOrName)) {
                    matchedStatus = status;
                    break;
                }
            }

            if (matchedStatus != null) {
                allItems = enrichItems(itemRepository.findByUserIdAndStatus(userId, matchedStatus));
            } else {
                // Custom list
                Optional<UserList> customList = listRepository.findByUserId(userId).stream()
                        .filter(l -> l.getId().toHexString().equals(listIdOrName) || l.getName().equalsIgnoreCase(listIdOrName))
                        .findFirst();

                if (customList.isPresent()) {
                    UserList list = customList.get();
                    if (list.getCriteria() != null) {
                        GameSearchDTO search = mapCriteriaToSearch(list.getCriteria());
                        search.setSize(500);
                        allItems = wrapGamesWithUserInfo(userId, gameSearchService.searchGames(search));
                    } else if (list.getGameIds() != null) {
                        List<UserGameListItem> items = itemRepository.findByUserId(userId).stream()
                                .filter(i -> list.getGameIds().contains(i.getGameId()))
                                .toList();
                        allItems = enrichItems(items);
                    } else {
                        allItems = new ArrayList<>();
                    }
                } else {
                    allItems = new ArrayList<>();
                }
            }
        }

        return buildGroupedResponse(allItems, groupBy);
    }

    private GroupedListResponse buildGroupedResponse(List<UserGameListItemDTO> items, String groupBy) {
        GroupedListResponse response = new GroupedListResponse(groupBy);
        Map<String, List<UserGameListItemDTO>> groups = new LinkedHashMap<>();

        for (UserGameListItemDTO item : items) {
            List<String> keys = extractGroupKeys(item, groupBy);
            for (String key : keys) {
                groups.computeIfAbsent(key, k -> new ArrayList<>()).add(item);
            }
        }

        // Sort groups by key
        TreeMap<String, List<UserGameListItemDTO>> sorted = new TreeMap<>(groups);
        response.setGroups(sorted);
        return response;
    }

    private List<String> extractGroupKeys(UserGameListItemDTO item, String groupBy) {
        Game game = item.getGame();
        if (game == null) return List.of("Unknown");

        return switch (groupBy.toLowerCase()) {
            case "genre" -> nullSafe(game.getGenreNames());
            case "platform" -> nullSafe(game.getPlatforms());
            case "gamemodes" -> nullSafe(game.getGameModes());
            case "theme" -> nullSafe(game.getThemes());
            case "franchise" -> {
                String f = game.getFranchise();
                yield f != null ? List.of(f) : List.of("No Franchise");
            }
            case "series" -> {
                String s = game.getSeriesName();
                yield s != null ? List.of(s) : List.of("No Series");
            }
            case "developer" -> nullSafe(game.getDevelopers());
            case "publisher" -> nullSafe(game.getPublishers());
            case "status" -> {
                yield item.getStatus() != null ? List.of(item.getStatus().name()) : List.of("No Status");
            }
            default -> List.of("Unknown Group");
        };
    }

    private List<String> nullSafe(List<String> list) {
        if (list == null || list.isEmpty()) return List.of("Unknown");
        return list;
    }

    // ─── Sorting Helpers ─────────────────────────────────────────────

    private Sort buildSort(String sortBy, String sortDirection) {
        Sort.Direction direction = "asc".equalsIgnoreCase(sortDirection) ? Sort.Direction.ASC : Sort.Direction.DESC;

        // Only use DB-level sort for fields that exist on UserGameListItem
        String dbField = switch (sortBy != null ? sortBy.toLowerCase() : "") {
            case "personalrating" -> "personalRating";
            case "lastupdated" -> "lastUpdated";
            default -> "lastUpdated"; // fallback
        };

        return Sort.by(direction, dbField);
    }

    private boolean isGameProperty(String sortBy) {
        if (sortBy == null) return false;
        return switch (sortBy.toLowerCase()) {
            case "gamename", "total_rating" -> true;
            default -> false;
        };
    }

    private void sortItems(List<UserGameListItemDTO> items, String sortBy, String sortDirection) {
        if (sortBy == null) return;
        boolean asc = "asc".equalsIgnoreCase(sortDirection);

        Comparator<UserGameListItemDTO> comparator = switch (sortBy.toLowerCase()) {
            case "personalrating" -> Comparator.comparing(
                    UserGameListItemDTO::getPersonalRating, Comparator.nullsLast(Comparator.naturalOrder()));
            case "lastupdated" -> Comparator.comparing(
                    UserGameListItemDTO::getLastUpdated, Comparator.nullsLast(Comparator.naturalOrder()));
            case "gamename" -> Comparator.comparing(
                    (UserGameListItemDTO dto) -> dto.getGame() != null ? dto.getGame().getName() : "",
                    Comparator.nullsLast(String.CASE_INSENSITIVE_ORDER));
            case "total_rating" -> Comparator.comparing(
                    (UserGameListItemDTO dto) -> dto.getGame() != null ? dto.getGame().getTotal_rating() : null,
                    Comparator.nullsLast(Comparator.naturalOrder()));
            default -> null;
        };

        if (comparator != null) {
            // We need a mutable list for sorting
            List<UserGameListItemDTO> mutable = new ArrayList<>(items);
            mutable.sort(asc ? comparator : comparator.reversed());
            items.clear();
            items.addAll(mutable);
        }
    }

    // ─── Enrichment Helpers ──────────────────────────────────────────

    private List<UserGameListItemDTO> enrichItems(List<UserGameListItem> items) {
        List<Integer> gameIds = items.stream().map(UserGameListItem::getGameId).toList();
        List<Game> games = gameRepository.findByIgdbIdIn(gameIds);
        Map<Integer, Game> gameMap = games.stream().collect(Collectors.toMap(Game::getIgdbId, g -> g, (a, b) -> a));

        return items.stream().map(item -> {
            UserGameListItemDTO dto = new UserGameListItemDTO();
            dto.setGame(gameMap.get(item.getGameId()));
            dto.setStatus(item.getStatus());
            dto.setPersonalRating(item.getPersonalRating());
            dto.setReview(item.getReview());
            dto.setLastUpdated(item.getLastUpdated());
            return dto;
        }).collect(Collectors.toCollection(ArrayList::new));
    }

    private List<UserGameListItemDTO> wrapGamesWithUserInfo(String userId, List<Game> games) {
        List<Integer> gameIds = games.stream().map(Game::getIgdbId).toList();
        List<UserGameListItem> userItems = itemRepository.findByUserId(userId);
        Map<Integer, UserGameListItem> userMap = userItems.stream()
                .filter(i -> gameIds.contains(i.getGameId()))
                .collect(Collectors.toMap(UserGameListItem::getGameId, i -> i, (a, b) -> a));

        return games.stream().map(game -> {
            UserGameListItemDTO dto = new UserGameListItemDTO();
            dto.setGame(game);
            UserGameListItem item = userMap.get(game.getIgdbId());
            if (item != null) {
                dto.setStatus(item.getStatus());
                dto.setPersonalRating(item.getPersonalRating());
                dto.setReview(item.getReview());
                dto.setLastUpdated(item.getLastUpdated());
            }
            return dto;
        }).collect(Collectors.toCollection(ArrayList::new));
    }

    // ─── Custom List CRUD ────────────────────────────────────────────

    public List<UserList> getUserLists(String userId) {
        return listRepository.findByUserId(userId);
    }

    public UserList createCustomList(String userId, String name, ListCriteria criteria) {
        // Check for duplicate list name
        boolean nameExists = listRepository.findByUserId(userId).stream()
                .anyMatch(l -> l.getName().equalsIgnoreCase(name));
        if (nameExists) {
            throw new ResourceAlreadyExistsException("A list named '" + name + "' already exists");
        }

        UserList list = new UserList();
        list.setUserId(userId);
        list.setName(name);
        list.setDefault(false);
        list.setCriteria(criteria);
        return listRepository.save(list);
    }

    private GameSearchDTO mapCriteriaToSearch(ListCriteria criteria) {
        GameSearchDTO search = new GameSearchDTO();
        if (criteria.getGenres() != null) search.setGenres(criteria.getGenres().stream().map(String::valueOf).toList());
        if (criteria.getPlatforms() != null) search.setPlatforms(criteria.getPlatforms().stream().map(String::valueOf).toList());
        if (criteria.getGameModes() != null) search.setGameModes(criteria.getGameModes());
        search.setSearchTerm(criteria.getSearchKeyword());
        search.setSize(100);
        return search;
    }
}
