package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KeywordRepository extends MongoRepository<Keyword, ObjectId> {
}
