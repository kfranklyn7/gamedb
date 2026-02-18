package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserGameListItemRepository extends MongoRepository<UserGameListItem, ObjectId> {
    List<UserGameListItem> findByUserId(String userId);
    List<UserGameListItem> findByUserIdAndStatus(String userId, GameStatus status);
    Optional<UserGameListItem> findByUserIdAndGameId(String userId, Integer gameId);

    // Paginated versions
    Page<UserGameListItem> findByUserId(String userId, Pageable pageable);
    Page<UserGameListItem> findByUserIdAndStatus(String userId, GameStatus status, Pageable pageable);

    long countByUserId(String userId);
    long countByUserIdAndStatus(String userId, GameStatus status);
}
