package com.management.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Orders") // Khớp với tên bảng trong MS SQL
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "total_price")
    private Double totalPrice;

    private String status; // PENDING, SHIPPING, COMPLETED, CANCELLED

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // --- Các trường mới thêm từ lệnh ALTER ---

    @Column(name = "receiver_name", columnDefinition = "NVARCHAR(100)")
    private String receiverName;

    @Column(name = "receiver_phone", columnDefinition = "NVARCHAR(20)")
    private String receiverPhone;

    @Column(name = "shipping_address", columnDefinition = "NVARCHAR(MAX)")
    private String shippingAddress;

    @Column(name = "payment_method", columnDefinition = "NVARCHAR(50)")
    private String paymentMethod; // Mặc định 'COD'

    @Column(name = "order_note", columnDefinition = "NVARCHAR(MAX)")
    private String orderNote;

    // Quan hệ với chi tiết đơn hàng
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderDetail> orderDetails;

    @PrePersist
    protected void onCreate() {
        this.orderDate = LocalDateTime.now();
        if (this.status == null)
            this.status = "PENDING";
        if (this.paymentMethod == null)
            this.paymentMethod = "COD";
    }
}