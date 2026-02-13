package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {
    @Autowired
    private GameService gameService;
    @GetMapping
    public Page<Game> allGames(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size,
                               @RequestParam(defaultValue = "id") String sortBy,
                               @RequestParam(defaultValue = "true") boolean ascending){
        //return new ResponseEntity<List<Game>>("All Games!", HttpStatus.OK);
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page,size,sort);
        return gameService.allGames(pageable);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Game>> getSingleGame(@PathVariable Integer id){
        return new ResponseEntity<Optional<Game>>(gameService.singleGame(id), HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<List<Game>> findByName(@RequestParam String name){
        return new ResponseEntity<>(gameService.findByName(name),HttpStatus.OK);
    }
}
