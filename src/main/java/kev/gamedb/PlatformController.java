package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("api/v1/platforms")
@RestController
public class PlatformController {
    @Autowired
    private PlatformService platformService;
    @GetMapping
    public Page<Platform> allPlatforms(@RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size,
                                       @RequestParam(defaultValue = "id") String sortBy,
                                       @RequestParam(defaultValue = "true") boolean ascending){
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page,size,sort);
        return platformService.allPlatforms(pageable);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Platform>> findById(@PathVariable Integer id){
        return new ResponseEntity<>(platformService.findById(id), HttpStatus.OK);
    }
}
