package kev.gamedb;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends MongoRepository<Company, ObjectId> {
    Optional<Company> findCompanyByIgdbId(Integer igdbId);

    List<Company> findByNameContainingIgnoreCase(String name);
}
