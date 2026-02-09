package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ThemeRepository extends MongoRepository<Theme, ObjectId> {
    List<Theme> findAllByNameContainingIgnoreCase(String name);
}
