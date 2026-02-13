package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FranchiseService {
    @Autowired
    private FranchiseRepository franchiseRepository;

    public List<Franchise> findByName(String name){
        return franchiseRepository.findByNameContainingIgnoreCase(name);
    }
    public Page<Franchise> allFranchises(Pageable pageable){return franchiseRepository.findAll(pageable);}
}
