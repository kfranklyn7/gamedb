package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/artworks")
public class ArtworkController {
    @Autowired
    private ArtworkService artworkService;
    @GetMapping
    public Page<Artwork> allArtworks(@RequestParam(defaultValue = "0")int page,@RequestParam(defaultValue = "10")int size,@RequestParam(defaultValue = "id")String sortBy,@RequestParam(defaultValue = "true") boolean ascending){
        Sort sort = ascending ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page,size,sort);
        return artworkService.allArtworks(pageable);
    }
}
