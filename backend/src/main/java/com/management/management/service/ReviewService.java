package com.management.management.service;

import com.management.management.entity.Review;
import com.management.management.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Page<Review> findAll(String search, Pageable pageable) {
        if (search == null || search.trim().isEmpty()) {
            return reviewRepository.findAll(pageable);
        }
        return reviewRepository.searchReviews(search.trim(), pageable);
    }

    public void delete(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Đánh giá không tồn tại!");
        }
        reviewRepository.deleteById(id);
    }
}