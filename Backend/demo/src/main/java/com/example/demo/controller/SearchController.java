package com.example.demo.controller;

import com.example.demo.dto.ProductFilterRequest;
import com.example.demo.entity.Product;
import com.example.demo.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class SearchController {
    @Autowired
    private SearchService searchService;

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam("keyword") String keyword) {
        return searchService.searchProducts(keyword);
    }

        // Add a new endpoint that combines search with filters
        @PostMapping("/search/filter")
        public List<Product> searchAndFilterProducts(
                @RequestParam("keyword") String keyword,
                @RequestBody ProductFilterRequest filterRequest) {
            
            return searchService.searchProductsWithFilters(
                    keyword,
                    filterRequest.getMinPrice(),
                    filterRequest.getMaxPrice(),
                    filterRequest.getCategoryId(),
                    filterRequest.getAuthor(),
                    filterRequest.getPublisher(),
                    filterRequest.getInStock()
            );
        }
}
