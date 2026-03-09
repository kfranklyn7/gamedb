package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlatformService {
    @Autowired
    private PlatformRepository platformRepository;

    @Cacheable(value = "platforms")
    public Page<Platform> allPlatforms(Pageable pageable) {
        return platformRepository.findAll(pageable);
    }

    public Optional<Platform> findById(Integer id) {
        return platformRepository.findByIgdbId(id);
    }

    public List<Platform> findByName(String name) {
        return platformRepository.findByNameContainingIgnoreCase(name);
    }
}
