package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoverRepository extends MongoRepository<Cover, ObjectId> {
}
