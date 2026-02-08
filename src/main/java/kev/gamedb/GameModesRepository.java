package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GameModesRepository extends MongoRepository<GameModes, ObjectId> {
}
