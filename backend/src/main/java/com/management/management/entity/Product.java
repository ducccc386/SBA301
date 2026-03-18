package com.management.management.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Đổi sang Long cho đồng bộ với User

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Double price;

    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    private String status;

    // --- PHẦN QUAN TRỌNG NHẤT ĐỂ FIX LỖI ---
    @ManyToOne
    @JoinColumn(name = "category_id") // Đây là cột khóa ngoại trong DB
    private Category category; // Biến này phải tên là 'category' để khớp với mappedBy bên file Category.java
}