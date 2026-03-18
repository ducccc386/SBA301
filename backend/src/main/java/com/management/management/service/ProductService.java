package com.management.management.service;

import com.management.management.entity.Product;
import com.management.management.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Lấy tất cả
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 2. Dành cho KHÁCH HÀNG: Chỉ lấy những cái đang Active
    public List<Product> getActiveProducts() {
        return productRepository.findByStatus("Active");
    }

    // Thêm mới
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Xóa
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Cập nhật
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        // Cập nhật các thông tin cơ bản
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStatus(productDetails.getStatus());

        // --- BỔ SUNG 2 DÒNG NÀY ĐỂ FIX LỖI ---
        product.setDescription(productDetails.getDescription()); // Cập nhật mô tả
        product.setCategory(productDetails.getCategory()); // Cập nhật danh mục

        return productRepository.save(product);
    }
}