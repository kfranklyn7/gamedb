package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/franchise")
public class FranchiseController {
    @Autowired
    private FranchiseService franchiseService;
    @GetMapping("/search")
    public ResponseEntity<List<Franchise>> findByName(@RequestParam(defaultValue = "Star Wars") String name){
        return new ResponseEntity<>(franchiseService.findByName(name), HttpStatus.OK);
    }
}
