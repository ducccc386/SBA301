package com.management.management.repository;

import com.management.management.entity.Order;
import com.management.management.entity.OrderDetail;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    Page<Order> findByReceiverNameContainingOrReceiverPhoneContaining(
            String receiverName,
            String receiverPhone,
            Pageable pageable);

    public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
        // Lấy chi tiết của một đơn hàng cụ thể
        List<OrderDetail> findByOrderId(Long orderId);
    }
}
