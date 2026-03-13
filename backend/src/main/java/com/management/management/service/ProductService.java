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

        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setQuantity(productDetails.getQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStatus(productDetails.getStatus());

        return productRepository.save(product);
    }
}