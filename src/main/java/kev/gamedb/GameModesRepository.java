package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface GameModesRepository extends MongoRepository<GameModes, ObjectId> {
    Optional<GameModes> findByIgdbId(Integer id);

}
