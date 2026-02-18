package kev.gamedb;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, org.bson.types.ObjectId> {
    // Spring generates the implementation for this automatically
    Optional<User> findByEmail(String email);
}
