package com.example.demo.controller;

import com.example.demo.dto.ProductFilterRequest;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public Page<Product> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getAllProducts(pageable);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }


    @GetMapping("/search/barcode")
    public List<Product> searchByBarcodePrefix(@RequestParam String prefix) {
        return productService.searchProductsByBarcodePrefix(prefix);
    }

    // New endpoints for filtering
    
    @PostMapping("/filter")
    public Page<Product> filterProducts(@RequestBody ProductFilterRequest filterRequest) {
        return productService.getFilteredProducts(filterRequest);
    }
    
    @GetMapping("/price-range")
    public Page<Product> getProductsByPriceRange(
            @RequestParam double minPrice,
            @RequestParam double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductsByPriceRange(minPrice, maxPrice, pageable);
    }
    
    @GetMapping("/author/{author}")
    public Page<Product> getProductsByAuthor(
            @PathVariable String author,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductsByAuthor(author, pageable);
    }
    
    @GetMapping("/publisher/{publisher}")
    public Page<Product> getProductsByPublisher(
            @PathVariable String publisher,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductsByPublisher(publisher, pageable);
    }
    
    @GetMapping("/in-stock")
    public Page<Product> getProductsInStock(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return productService.getProductsInStock(pageable);
    }
    
    // Endpoints to get filter options for dropdowns
    
    @GetMapping("/authors")
    public List<String> getAllAuthors() {
        return productService.getAllAuthors();
    }
    
    @GetMapping("/publishers")
    public List<String> getAllPublishers() {
        return productService.getAllPublishers();
    }
}

