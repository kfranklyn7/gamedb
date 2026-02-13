package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GenreRepository extends MongoRepository<Genre, ObjectId> {
    List<Genre> findAllByNameContainingIgnoreCase(String name);
}
