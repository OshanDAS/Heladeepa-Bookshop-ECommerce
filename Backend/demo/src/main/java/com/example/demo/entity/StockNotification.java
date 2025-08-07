package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stock_notification")
public class StockNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @ManyToOne
    @JoinColumn(name = "product_id",nullable = false)
    private Product product;

    private boolean notified = false;

    public StockNotification() {

    }

    public StockNotification(Long id, String email, Product product, boolean notified) {
        this.id = id;
        this.email = email;
        this.product = product;
        this.notified = notified;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public boolean isNotified() {
        return notified;
    }

    public void setNotified(boolean notified) {
        this.notified = notified;
    }
}
