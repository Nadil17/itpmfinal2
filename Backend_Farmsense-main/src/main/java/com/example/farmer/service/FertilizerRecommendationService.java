package com.example.farmer.service;

import com.example.farmer.model.FertilizerRecommendation;
import com.example.farmer.model.RecommendationRequest;
import com.example.farmer.repository.FertilizerRecommendationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FertilizerRecommendationService {

    @Autowired
    private FertilizerRecommendationRepository repository;

    @Autowired
    private AIRecommendationService aiService;

    public List<FertilizerRecommendation> getAllRecommendations() {
        return repository.findAll();
    }

    public List<FertilizerRecommendation> getRecommendationsByFarmerId(String farmerId) {
        return repository.findByFarmerId(farmerId);
    }

    public Optional<FertilizerRecommendation> getRecommendationById(Long id) {
        return repository.findById(id);
    }

    public FertilizerRecommendation createRecommendation(

            RecommendationRequest request) {
        FertilizerRecommendation recommendation = new FertilizerRecommendation();
        recommendation.setFarmerId(request.getFarmerId());
        recommendation.setCropType(request.getCropType());
        recommendation.setSoilCondition(request.getSoilCondition());
        recommendation.setPestProblems(request.getPestProblems());

        // Get AI recommendations
        String fertilizerRecommendation = aiService.getFertilizerRecommendation(
                request.getCropType(), request.getSoilCondition());
        String chemicalRecommendation = aiService.getChemicalRecommendation(
                request.getCropType(), request.getPestProblems());

        recommendation.setFertilizerRecommendation(fertilizerRecommendation);
        recommendation.setChemicalRecommendation(chemicalRecommendation);
        recommendation.setAiGenerated(true);

        return repository.save(recommendation);
    }

    public FertilizerRecommendation updateRecommendation(Long id, FertilizerRecommendation updatedRecommendation) {
        Optional<FertilizerRecommendation> existingRecommendation = repository.findById(id);

        if (existingRecommendation.isPresent()) {
            FertilizerRecommendation recommendation = existingRecommendation.get();
            recommendation.setCropType(updatedRecommendation.getCropType());
            recommendation.setSoilCondition(updatedRecommendation.getSoilCondition());
            recommendation.setPestProblems(updatedRecommendation.getPestProblems());
            recommendation.setFertilizerRecommendation(updatedRecommendation.getFertilizerRecommendation());
            recommendation.setChemicalRecommendation(updatedRecommendation.getChemicalRecommendation());

            // If manually modified, update the AI generated flag
            if (!recommendation.getFertilizerRecommendation().equals(
                    aiService.getFertilizerRecommendation(recommendation.getCropType(), recommendation.getSoilCondition())) ||
                    !recommendation.getChemicalRecommendation().equals(
                            aiService.getChemicalRecommendation(recommendation.getCropType(), recommendation.getPestProblems()))) {
                recommendation.setAiGenerated(false);
            }

            return repository.save(recommendation);
        }

        return null;
    }

    public boolean deleteRecommendation(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}