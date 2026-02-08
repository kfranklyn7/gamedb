package kev.gamedb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyService {
    @Autowired
    private CompanyRepository companyRepository;
    public Page<Company> allCompanies(Pageable pageable){
        return companyRepository.findAll(pageable);
    }
    public Optional<Company> getSingleCompanyById(Integer igdbId){
        return companyRepository.findCompanyByIgdbId(igdbId);
    }
    public List<Company> getCompanyByNameLike(String name){
        return companyRepository.findByNameContainingIgnoreCase(name);
    }
}
