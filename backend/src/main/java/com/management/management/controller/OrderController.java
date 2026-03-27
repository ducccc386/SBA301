package com.management.management.controller;

import com.management.management.entity.Order;
import com.management.management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders") // Khớp với URL Frontend gọi
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        try {
            // Gọi service để lưu đơn hàng và trừ tồn kho (nếu có)
            Order savedOrder = orderService.saveOrder(order);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi khi lưu đơn hàng: " + e.getMessage());
        }
    }
}