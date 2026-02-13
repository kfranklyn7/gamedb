package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class GameModesService {
    @Autowired
    private GameModesRepository gameModesRepository;
    public Optional<GameModes> findById(Integer id){
        return gameModesRepository.findByIgdbId(id);
    }
    public Page<GameModes> allGameModes(Pageable pageable){
        return gameModesRepository.findAll(pageable);
    }

}
