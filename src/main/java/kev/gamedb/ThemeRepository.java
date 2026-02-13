package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ThemeRepository extends MongoRepository<Theme, ObjectId> {
    List<Theme> findAllByNameContainingIgnoreCase(String name);
    Optional<Theme> findByIgdbId(Integer igdbId);
}
