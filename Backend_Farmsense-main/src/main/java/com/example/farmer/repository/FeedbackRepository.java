package com.example.farmer.repository;

import com.example.farmer.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProductId(Long productId);
    List<Feedback> findByUserId(Long userId);
    List<Feedback> findByProductIdAndRating(Long productId, Integer rating);
}