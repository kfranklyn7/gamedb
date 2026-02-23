package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.core.MongoTemplate;
import jakarta.annotation.PostConstruct;

@Service
public class GameService {
    @Autowired
    private GameRepository gameRepository;
    
    @Autowired
    private MongoTemplate mongoTemplate;

    @PostConstruct
    public void init() {
        System.out.println("!!!!! DEBUG: MongoTemplate DB Name: " + mongoTemplate.getDb().getName() + " !!!!!");
    }
    public Page<Game> allGames(Pageable pageable){
        return gameRepository.findAll(pageable);
    }
    @Cacheable(value = "games", key = "#id")
    public Optional<Game> singleGame(Integer id){
        return gameRepository.findByIgdbId(id);
    }
    public List<Game> findByName(String name){
        return gameRepository.findByNameContainingIgnoreCase(name);
    }
}
