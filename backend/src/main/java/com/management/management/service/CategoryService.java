package com.management.management.service;

import com.management.management.entity.Category;
import com.management.management.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category saveCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public Category getCategoryById(Long id) {
        // Tận dụng class ResourceNotFoundException bạn đã có
        return categoryRepository.findById(id)
                .orElseThrow(() -> new com.management.management.exception.ResourceNotFoundException(
                        "Không tìm thấy danh mục với ID: " + id));
    }
}