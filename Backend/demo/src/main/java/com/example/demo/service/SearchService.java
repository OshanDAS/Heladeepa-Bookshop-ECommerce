package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    // New method to search products with filters
    public List<Product> searchProductsWithFilters(
            String keyword,
            Double minPrice,
            Double maxPrice,
            Long categoryId,
            String author,
            String publisher,
            Boolean inStock) {
        
        // First get search results
        List<Product> searchResults = productRepository.searchProducts(keyword);
        
        // Then apply filters to search results
        return searchResults.stream()
                .filter(product -> minPrice == null || product.getPrice() >= minPrice)
                .filter(product -> maxPrice == null || product.getPrice() <= maxPrice)
                .filter(product -> categoryId == null || 
                        (product.getCategory() != null && product.getCategory().getId() == categoryId))
                .filter(product -> author == null || 
                        (product.getAuthor() != null && 
                         product.getAuthor().toLowerCase().contains(author.toLowerCase())))
                .filter(product -> publisher == null || 
                        (product.getPublisher() != null && 
                         product.getPublisher().toLowerCase().contains(publisher.toLowerCase())))
                .filter(product -> inStock == null || 
                        (inStock && product.getStock() > 0) || 
                        (!inStock && product.getStock() == 0))
                .collect(Collectors.toList());
    }
}
