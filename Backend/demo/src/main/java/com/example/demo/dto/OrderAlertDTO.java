package com.example.demo.dto;

import com.example.demo.entity.OrderProduct;

import java.time.LocalDateTime;
import java.util.List;

public class OrderAlertDTO {
    private String orderId;
    private String customerName;
    private LocalDateTime createdAt;
    private List<OrderProduct> items;

    public OrderAlertDTO(String orderId, String customerName, LocalDateTime createdAt, List<OrderProduct> items) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.createdAt = createdAt;
        this.items = items;
    }

    // Getters and setters


    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderProduct> getItems() {
        return items;
    }

    public void setItems(List<OrderProduct> items) {
        this.items = items;
    }
}