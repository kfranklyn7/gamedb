package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    @Autowired
    private GameRepository gameRepository;
    public Page<Game> allGames(Pageable pageable){
        return gameRepository.findAll(pageable);
    }
    public Optional<Game> singleGame(Integer id){
        return gameRepository.findByIgdbId(id);
    }
    public List<Game> findByName(String name){
        return gameRepository.findByNameContainingIgnoreCase(name);
    }
}
