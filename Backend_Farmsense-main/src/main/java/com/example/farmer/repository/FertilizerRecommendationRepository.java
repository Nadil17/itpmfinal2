package com.example.farmer.repository;

import com.example.farmer.model.FertilizerRecommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FertilizerRecommendationRepository extends JpaRepository<FertilizerRecommendation, Long> {

    List<FertilizerRecommendation> findByFarmerId(String farmerId);

    List<FertilizerRecommendation> findByFarmerIdAndCropType(String farmerId, String cropType);
}
