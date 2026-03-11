package com.management.management.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    // mappedBy = "category" trỏ đúng đến tên biến bên lớp Product
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    @JsonIgnore // Thêm dòng này để tránh lỗi vòng lặp vô hạn khi gọi API
    private List<Product> products;
}