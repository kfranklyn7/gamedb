package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PlatformService {
    @Autowired
    private PlatformRepository platformRepository;
    public Page<Platform>  allPlatforms(Pageable pageable){
        return platformRepository.findAll(pageable);
    }
    public Optional<Platform> findById(Integer id){
        return platformRepository.findByIgdbId(id);
    }
}
