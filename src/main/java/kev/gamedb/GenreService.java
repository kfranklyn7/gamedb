package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenreService {
    @Autowired
    private GenreRepository genreRepository;
    public Page<Genre> allGenres(Pageable pageable){
        return genreRepository.findAll(pageable);
    }
    public List<Genre> findByName(String name){return genreRepository.findAllByNameContainingIgnoreCase(name);}
}
