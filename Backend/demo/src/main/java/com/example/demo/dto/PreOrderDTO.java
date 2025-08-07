package com.example.demo.dto;

import com.example.demo.entity.PreOrder;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class PreOrderDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String author;
    private double price;
    private int quantity;
    private LocalDateTime orderDate;
    private LocalDate releaseDate;
    private String status;
    
    public PreOrderDTO() {
    }
    
    public PreOrderDTO(PreOrder preOrder) {
        this.id = preOrder.getId();
        this.productId = preOrder.getProduct().getId();
        this.productName = preOrder.getProduct().getName();
        this.productImageUrl = preOrder.getProduct().getImageUrl();
        this.author = preOrder.getProduct().getAuthor();
        this.price = preOrder.getProduct().getPrice();
        this.quantity = preOrder.getQuantity();
        this.orderDate = preOrder.getOrderDate();
        this.releaseDate = preOrder.getProduct().getReleaseDate();
        this.status = preOrder.getStatus().name();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
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

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
