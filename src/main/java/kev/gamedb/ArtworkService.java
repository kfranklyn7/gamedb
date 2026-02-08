package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ArtworkService {
    @Autowired
    private ArtworkRepository artworkRepository;
    public Page<Artwork> allArtworks(Pageable pageable){
        return artworkRepository.findAll(pageable);
    }
}
