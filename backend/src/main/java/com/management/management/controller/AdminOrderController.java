package com.management.management.controller;

import com.management.management.entity.Order;
import com.management.management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin("*") // Để React gọi được API
public class AdminOrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<?> listOrders(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(orderService.getAllOrders(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getDetail(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return order != null ? ResponseEntity.ok(order) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        Order updated = orderService.updateStatus(id, status);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.badRequest().build();
    }

}