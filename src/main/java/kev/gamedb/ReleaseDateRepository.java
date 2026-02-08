package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReleaseDateRepository extends MongoRepository<ReleaseDate, ObjectId> {
}
