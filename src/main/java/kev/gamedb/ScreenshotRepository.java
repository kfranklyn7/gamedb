package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScreenshotRepository extends MongoRepository<Screenshot, ObjectId> {
}
