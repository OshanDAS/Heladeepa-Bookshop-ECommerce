package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private double discountPercentage;

    @Column(nullable = false)
    private LocalDateTime startDate;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false, columnDefinition = "TEXT") // Store as JSON string
    private String applicableProducts; // JSON format for product IDs

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ACTIVE, INACTIVE
    }

    // Constructors
    public Promotion() {}

    public Promotion(String name, String code, double discountPercentage, LocalDateTime startDate, LocalDateTime expiryDate, String applicableProducts, Status status) {
        this.name = name;
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.startDate = startDate;
        this.expiryDate = expiryDate;
        this.applicableProducts = applicableProducts;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(double discountPercentage) {
        if (discountPercentage < 0 || discountPercentage > 100) {
            throw new IllegalArgumentException("Discount must be between 0% and 100%");
        }
        this.discountPercentage = discountPercentage;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getApplicableProducts() {
        return applicableProducts;
    }

    public void setApplicableProducts(String applicableProducts) {
        this.applicableProducts = applicableProducts;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // Auto-validation before saving/updating
    @PrePersist
    @PreUpdate
    private void validateDates() {
        if (startDate != null && expiryDate != null && startDate.isAfter(expiryDate)) {
            throw new IllegalArgumentException("Start date must be before expiry date.");
        }
    }
}