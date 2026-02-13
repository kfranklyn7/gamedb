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
@RequestMapping("/api/v1/themes")
public class ThemeController {
    @Autowired
    private ThemeService themeService;
    @GetMapping()
    public Page<Theme> findAllThemes(@RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "10") int size,
                                     @RequestParam(defaultValue = "id") String sortBy,
                                     @RequestParam(defaultValue = "true") boolean ascending){
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page,size,sort);
        return themeService.findAllThemes(pageable);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Theme>> findById(@PathVariable Integer id){
        return new ResponseEntity<>(themeService.findById(id),HttpStatus.OK);
    }
    @GetMapping("/search")
    public ResponseEntity<List<Theme>> findByName(@RequestParam String name){
        return new ResponseEntity<>(themeService.findByName(name), HttpStatus.OK);
    }
}
