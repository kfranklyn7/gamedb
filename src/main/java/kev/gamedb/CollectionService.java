package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectionService {
    @Autowired
    private CollectionRepository collectionRepository;

    public Page<Collection> allCollections(Pageable pageable) {
        return collectionRepository.findAll(pageable); //
    }
    public List<Collection> findCollectionByName(String name){
        return collectionRepository.findByNameContainingIgnoreCase(name);
    }
}