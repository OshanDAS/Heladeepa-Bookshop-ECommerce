package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pre_orders")
public class PreOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;
    private LocalDateTime orderDate;
    
    @Enumerated(EnumType.STRING)
    private PreOrderStatus status;
    
    private boolean notificationSent;

    public enum PreOrderStatus {
        PENDING,    // Waiting for release date
        RELEASED,   // Item released, customer notified to add to cart
        CANCELLED   // Pre-order cancelled
    }

    // Constructors
    public PreOrder() {
        this.orderDate = LocalDateTime.now();
        this.status = PreOrderStatus.PENDING;
        this.notificationSent = false;
    }

    public PreOrder(User user, Product product, int quantity) {
        this();
        this.user = user;
        this.product = product;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public PreOrderStatus getStatus() {
        return status;
    }

    public void setStatus(PreOrderStatus status) {
        this.status = status;
    }

    public boolean isNotificationSent() {
        return notificationSent;
    }

    public void setNotificationSent(boolean notificationSent) {
        this.notificationSent = notificationSent;
    }

    // Helper methods
    public boolean canBeCancelled() {
        return status == PreOrderStatus.PENDING && 
               product.getReleaseDate() != null && 
               product.getReleaseDate().isAfter(LocalDate.now());
    }
}
