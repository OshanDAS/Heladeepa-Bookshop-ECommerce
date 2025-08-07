package com.example.demo.controller;

import com.example.demo.entity.Promotion;
import com.example.demo.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin
public class PromotionController {

    private final PromotionService promotionService;

    @Autowired
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    // Public: Anyone can view promotions
    @GetMapping
    public List<Promotion> getAllPromotions() {
        List<Promotion> promotions = promotionService.getAllPromotions();
        return promotions != null ? promotions : List.of();
    }

    // Public: Anyone can view a single promotion
    @GetMapping("/{id}")
    public ResponseEntity<Promotion> getPromotionById(@PathVariable Long id) {
        Optional<Promotion> promotion = promotionService.getPromotionById(id);
        return promotion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Public: Validate discount code at checkout
    @GetMapping("/validate-code")
    public ResponseEntity<?> validateDiscountCode(@RequestParam String code) {
        Optional<Promotion> promotionOpt = promotionService.validateDiscountCode(code);

        if (promotionOpt.isPresent()) {
            Promotion promotion = promotionOpt.get();
            return ResponseEntity.ok().body(promotion);
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired discount code.");
        }
    }

    // Admin Only: Create a new promotion
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Promotion> createPromotion(@RequestBody Promotion promotion) {
        try {
            Promotion newPromotion = promotionService.createPromotion(promotion);
            return ResponseEntity.ok(newPromotion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Admin Only: Update an existing promotion
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Promotion> updatePromotion(@PathVariable Long id, @RequestBody Promotion promotion) {
        try {
            Promotion updatedPromotion = promotionService.updatePromotion(id, promotion);
            return ResponseEntity.ok(updatedPromotion);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin Only: Delete a promotion
    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }
}