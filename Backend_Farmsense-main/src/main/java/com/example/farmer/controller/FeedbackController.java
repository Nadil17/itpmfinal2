package com.example.farmer.controller;

import com.example.farmer.model.Feedback;
import com.example.farmer.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@CrossOrigin
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    private final String UPLOAD_DIR = "uploads/feedback-images/";

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Feedback>> getFeedbackByProduct(@PathVariable Long productId) {
        List<Feedback> feedbacks = feedbackService.getAllFeedbackForProduct(productId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbackByUser(@PathVariable Long userId) {
        List<Feedback> feedbacks = feedbackService.getAllFeedbackByUser(userId);
        return ResponseEntity.ok(feedbacks);
    }

    @PostMapping
    public ResponseEntity<Feedback> addFeedback(
            @RequestParam("productId") Long productId,
            @RequestParam("userId") Long userId,
            @RequestParam("comment") String comment,
            @RequestParam("rating") Integer rating,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            try {
                // Create upload directory if it doesn't exist
                Files.createDirectories(Paths.get(UPLOAD_DIR));
                
                // Generate unique filename
                String filename = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(UPLOAD_DIR + filename);
                
                // Save file
                Files.copy(image.getInputStream(), filePath);
                imageUrl = "/feedback-images/" + filename;
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        Feedback feedback = feedbackService.addFeedback(productId, userId, comment, rating, imageUrl);
        return new ResponseEntity<>(feedback, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, Object> request) {

        Long userId = Long.valueOf(request.get("userId").toString());
        String comment = (String) request.get("comment");
        Integer rating = Integer.valueOf(request.get("rating").toString());

        // Check if feedback exists
        Optional<Feedback> existingFeedback = feedbackService.getFeedbackById(id);
        if (!existingFeedback.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Check if the user is authorized to update this feedback
        if (!existingFeedback.get().getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not authorized to update this feedback"));
        }

        Feedback updatedFeedback = feedbackService.updateFeedback(id, comment, rating, null);
        return ResponseEntity.ok(updatedFeedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(
            @PathVariable Long id,
            @RequestParam Long userId) {

        // Check if feedback exists
        Optional<Feedback> existingFeedback = feedbackService.getFeedbackById(id);
        if (!existingFeedback.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Check if the user is authorized to delete this feedback
        if (!existingFeedback.get().getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not authorized to delete this feedback"));
        }

        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}/rating")
    public ResponseEntity<Map<String, Double>> getProductAverageRating(@PathVariable Long productId) {
        double avgRating = feedbackService.getAverageRatingForProduct(productId);
        return ResponseEntity.ok(Map.of("averageRating", avgRating));
    }
}