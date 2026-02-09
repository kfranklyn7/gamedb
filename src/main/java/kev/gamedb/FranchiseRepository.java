package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FranchiseRepository extends MongoRepository<Franchise, ObjectId> {
    List<Franchise> findByNameContainingIgnoreCase(String name);
}