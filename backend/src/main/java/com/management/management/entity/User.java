package com.management.management.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Users") // Nên viết hoa chữ U nếu trong MS SQL bạn đặt là Users
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String role; // "ROLE_ADMIN" hoặc "ROLE_USER"

    @Column(unique = true) // Đảm bảo email không trùng lặp
    private String email;

    private String phone;

    @Column(columnDefinition = "NVARCHAR(MAX)") // Chỉ định rõ kiểu dữ liệu hỗ trợ tiếng Việt trong MS SQL
    private String address;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- Tự động gán ngày tạo khi thêm mới ---
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}