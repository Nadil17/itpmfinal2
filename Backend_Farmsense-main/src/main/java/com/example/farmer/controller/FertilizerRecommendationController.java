package com.example.farmer.controller;

import com.example.farmer.model.FertilizerRecommendation;
import com.example.farmer.model.RecommendationRequest;
import com.example.farmer.service.FertilizerRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class FertilizerRecommendationController {

    @Autowired
    private FertilizerRecommendationService service;

    @GetMapping
    public ResponseEntity<List<FertilizerRecommendation>> getAllRecommendations() {
        return ResponseEntity.ok(service.getAllRecommendations());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<FertilizerRecommendation>> getRecommendationsByFarmerId(@PathVariable String farmerId) {
        return ResponseEntity.ok(service.getRecommendationsByFarmerId(farmerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FertilizerRecommendation> getRecommendationById(@PathVariable Long id) {
        Optional<FertilizerRecommendation> recommendation = service.getRecommendationById(id);
        return recommendation
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FertilizerRecommendation> createRecommendation(@RequestBody RecommendationRequest request) {
        FertilizerRecommendation createdRecommendation = service.createRecommendation(request);
        return new ResponseEntity<>(createdRecommendation, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FertilizerRecommendation> updateRecommendation(
            @PathVariable Long id,
            @RequestBody FertilizerRecommendation recommendation) {
        FertilizerRecommendation updatedRecommendation = service.updateRecommendation(id, recommendation);

        if (updatedRecommendation != null) {
            return ResponseEntity.ok(updatedRecommendation);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecommendation(@PathVariable Long id) {
        boolean deleted = service.deleteRecommendation(id);

        if (deleted) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }
}