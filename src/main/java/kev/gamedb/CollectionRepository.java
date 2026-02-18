package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface CollectionRepository extends MongoRepository<Collection, ObjectId> {
    List<Collection> findByNameContainingIgnoreCase(String name);
}
