package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserListRepository extends MongoRepository<UserList, ObjectId> {
    List<UserList> findByUserId(String userId);
    List<UserList> findByUserIdAndIsDefaultTrue(String userId);
    java.util.Optional<UserList> findByIdAndUserId(ObjectId id, String userId);
}
