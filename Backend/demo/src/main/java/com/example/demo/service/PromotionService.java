package com.example.demo.service;

import com.example.demo.entity.Promotion;
import com.example.demo.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    // Fetch all promotions
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // Fetch a single promotion by ID
    public Optional<Promotion> getPromotionById(Long id) {
        return promotionRepository.findById(id);
    }

    // Create a new promotion with proper validation
    public Promotion createPromotion(Promotion promotion) {
        if (promotion.getDiscountPercentage() < 0 || promotion.getDiscountPercentage() > 100) {
            throw new IllegalArgumentException("Discount must be between 0% and 100%");
        }
        if (promotion.getStartDate() == null || promotion.getExpiryDate() == null) {
            throw new IllegalArgumentException("Start date and expiry date cannot be null");
        }
        if (promotion.getStartDate().isAfter(promotion.getExpiryDate())) {
            throw new IllegalArgumentException("Start date must be before expiry date");
        }

        // Set default status if not provided
        if (promotion.getStatus() == null) {
            promotion.setStatus(Promotion.Status.ACTIVE);
        }

        return promotionRepository.save(promotion);
    }

    // Update an existing promotion with error handling
    public Promotion updatePromotion(Long id, Promotion updatedPromotion) {
        return promotionRepository.findById(id).map(promotion -> {
            promotion.setName(updatedPromotion.getName());
            promotion.setDiscountPercentage(updatedPromotion.getDiscountPercentage());
            promotion.setStartDate(updatedPromotion.getStartDate());
            promotion.setExpiryDate(updatedPromotion.getExpiryDate());
            promotion.setApplicableProducts(updatedPromotion.getApplicableProducts());
            promotion.setStatus(updatedPromotion.getStatus()); // Allow status updates
            return promotionRepository.save(promotion);
        }).orElseThrow(() -> new IllegalArgumentException("Promotion with ID " + id + " not found"));
    }

    // Delete a promotion by ID
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new IllegalArgumentException("Promotion with ID " + id + " not found");
        }
        promotionRepository.deleteById(id);
    }

    // Remove expired promotions efficiently
    public void removeExpiredPromotions() {
        List<Promotion> expiredPromotions = promotionRepository.findExpiredActivePromotions(LocalDateTime.now());
        promotionRepository.deleteAll(expiredPromotions);
    }

    // Validate and return a promotion by code if it's active and not expired
    public Optional<Promotion> validateDiscountCode(String code) {
        Promotion promotion = promotionRepository.findByCode(code);
        if (promotion != null
                && promotion.getStatus() == Promotion.Status.ACTIVE
                && LocalDateTime.now().isBefore(promotion.getExpiryDate())
                && LocalDateTime.now().isAfter(promotion.getStartDate())) {
            return Optional.of(promotion);
        }
        return Optional.empty();
    }
}
