package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/categories")
@CrossOrigin
public class CategoryController {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Category saved = categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
