package com.management.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime orderDate;

    private Double totalPrice;

    private String status; // Ví dụ: "PENDING", "COMPLETED"

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Người mua hàng

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDateTime.now();
    }
}
