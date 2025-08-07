package com.example.demo.controller;

import com.example.demo.dto.ProductUpdateDTO;
import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductService productService;

    @Autowired
    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }


    @PostMapping(value = "/{id}",consumes  = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") ProductUpdateDTO productDTO,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) throws IOException {
        Product updated = productService.updateProduct(id, productDTO, image);
        return ResponseEntity.ok(updated);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public Page<Product> searchProductsByName(@RequestParam String name, Pageable pageable) {
        return productService.searchByName(name, pageable);
    }

    @GetMapping("/category")
    public Page<Product> getProductsByCategory(@RequestParam Long categoryId, Pageable pageable) {
        return productService.filterByCategory(categoryId, pageable);
    }

    @GetMapping("/stock")
    public Page<Product> getProductsByStock(@RequestParam int maxStock, Pageable pageable) {
        return productService.filterByStockLevel(maxStock, pageable);
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Product> addProduct(
            @RequestPart("product") String productJson,
            @RequestPart("image") MultipartFile imageFile) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        ProductUpdateDTO dto = mapper.readValue(productJson, ProductUpdateDTO.class);
        return ResponseEntity.ok(productService.addProduct(dto, imageFile));
    }


}
