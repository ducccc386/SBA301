package com.management.management.service;

import com.management.management.entity.Order;
import com.management.management.entity.OrderDetail;
import com.management.management.entity.Product;
import com.management.management.repository.OrderRepository;
import com.management.management.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductRepository productRepository;

    // Lấy danh sách có phân trang và tìm kiếm
    public Page<Order> getAllOrders(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return orderRepository.findByReceiverNameContainingOrReceiverPhoneContaining(search, search, pageable);
        }
        return orderRepository.findAll(pageable);
    }

    // Xem chi tiết (Read)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    // Cập nhật trạng thái + Validate hoàn kho
    @Transactional
    public Order updateStatus(Long id, String newStatus) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null)
            return null;

        String oldStatus = order.getStatus();

        // LOGIC QUAN TRỌNG: Nếu chuyển từ trạng thái khác sang CANCELLED thì cộng lại
        // kho
        if ("CANCELLED".equalsIgnoreCase(newStatus) && !"CANCELLED".equalsIgnoreCase(oldStatus)) {
            for (OrderDetail detail : order.getOrderDetails()) {
                Product product = detail.getProduct();
                if (product != null) {
                    product.setQuantity(product.getQuantity() + detail.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        // Nếu lỡ tay bấm nhầm từ CANCELLED quay lại PENDING thì phải trừ kho đi
        if (!"CANCELLED".equalsIgnoreCase(newStatus) && "CANCELLED".equalsIgnoreCase(oldStatus)) {
            for (OrderDetail detail : order.getOrderDetails()) {
                Product product = detail.getProduct();
                product.setQuantity(product.getQuantity() - detail.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(newStatus.toUpperCase());
        return orderRepository.save(order);
    }
}