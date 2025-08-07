package com.example.demo.controller;

import com.example.demo.dto.FileValidationResult;
import com.example.demo.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/upload")
public class AdminUploadController {

    private final ProductService productService;

    public AdminUploadController(ProductService productService) {
        this.productService = productService;
    }

    // Admin Only: Bulk upload books from CSV or Excel
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/books")
    public ResponseEntity<?> uploadBooks(@RequestParam("file") MultipartFile file) {
        try {
            // Step 1: Validate the file
            FileValidationResult validationResult = productService.validateBooksFile(file);

            if (!validationResult.getErrors().isEmpty()) {
                // Return the list of errors to the frontend
                return ResponseEntity.badRequest().body(validationResult);
            }

            // Step 2: Import the books if validation passed
            productService.importBooksFromFile(file);
            return ResponseEntity.ok("Books uploaded successfully.");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid file format: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload failed: " + e.getMessage());
        }
    }

}