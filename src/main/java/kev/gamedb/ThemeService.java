package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThemeService {
    @Autowired
    private ThemeRepository themeRepository;
    public Page<Theme> findAllThemes(Pageable pageable){
        return themeRepository.findAll(pageable);
    }
    public Optional<Theme> findById(Integer id){ return themeRepository.findByIgdbId(id);}
    public List<Theme> findByName(String name){
        return themeRepository.findAllByNameContainingIgnoreCase(name);
    }
}
