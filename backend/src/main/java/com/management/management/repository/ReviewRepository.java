package com.management.management.repository;

import com.management.management.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Tìm kiếm theo nội dung bình luận hoặc tên người dùng
    @Query("SELECT r FROM Review r WHERE " +
            "LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.user.username) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Review> searchReviews(@Param("search") String search, Pageable pageable);
}