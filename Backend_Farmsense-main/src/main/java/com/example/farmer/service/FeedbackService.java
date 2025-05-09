package com.example.farmer.service;

import com.example.farmer.Authentication.User;
import com.example.farmer.Authentication.UserRepository;
import com.example.farmer.model.Feedback;
import com.example.farmer.model.Product;
import com.example.farmer.repository.FeedbackRepository;
import com.example.farmer.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Feedback> getAllFeedbackForProduct(Long productId) {
        return feedbackRepository.findByProductId(productId);
    }

    public List<Feedback> getAllFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public Feedback addFeedback(Long productId, Long userId, String comment, Integer rating, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setProduct(product);
        feedback.setUser(user);
        feedback.setComment(comment);
        feedback.setRating(rating);
        feedback.setImageUrl(imageUrl);

        return feedbackRepository.save(feedback);
    }

    public Feedback updateFeedback(Long id, String comment, Integer rating, String imageUrl) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setComment(comment);
        feedback.setRating(rating);
        if (imageUrl != null) {
            feedback.setImageUrl(imageUrl);
        }

        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }

    public double getAverageRatingForProduct(Long productId) {
        List<Feedback> feedbacks = getAllFeedbackForProduct(productId);
        if (feedbacks.isEmpty()) {
            return 0.0;
        }

        double sum = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .sum();

        return sum / feedbacks.size();
    }
}