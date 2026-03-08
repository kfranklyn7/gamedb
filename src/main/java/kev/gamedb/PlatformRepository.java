package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PlatformRepository extends MongoRepository<Platform, ObjectId> {
    Optional<Platform> findByIgdbId(Integer igdbId);

    List<Platform> findByNameContainingIgnoreCase(String name);
}
