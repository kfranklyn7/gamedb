package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlatformRepository extends MongoRepository<Platform, ObjectId> {
}
