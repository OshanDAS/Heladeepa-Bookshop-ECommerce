package com.example.demo.controller;

import com.example.demo.dto.ProductFilterRequest;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.service.CategoryService;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/filters")
@CrossOrigin
public class FilterController {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private CategoryService categoryService;
    
    @GetMapping("/options")
    public ResponseEntity<Map<String, Object>> getFilterOptions() {
        Map<String, Object> filterOptions = new HashMap<>();
        
        // Get all categories
        List<Category> categories = categoryService.findAll();
        filterOptions.put("categories", categories);
        
        // Get all authors
        List<String> authors = productService.getAllAuthors();
        filterOptions.put("authors", authors);
        
        // Get all publishers
        List<String> publishers = productService.getAllPublishers();
        filterOptions.put("publishers", publishers);
        
        return ResponseEntity.ok(filterOptions);
    }
    
    @PostMapping("/products")
    public Page<Product> getFilteredProducts(@RequestBody ProductFilterRequest filterRequest) {
        return productService.getFilteredProducts(filterRequest);
    }
}