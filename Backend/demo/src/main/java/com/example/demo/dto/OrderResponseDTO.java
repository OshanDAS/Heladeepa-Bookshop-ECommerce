package com.example.demo.dto;



import java.util.List;

public class OrderResponseDTO {

    private String orderId;
    private Double amount;
    private String status;
    private String createdAt;
    private String updatedAt;
    private Long userId; // Only user ID, not full user details
    private String userName;

    private List<OrderProductDTO> orderProducts; // Only relevant details about the products in the order

    // Getters and setters

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<OrderProductDTO> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProductDTO> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public void setUserName(String name) {
        this.userName = name;
    }
    public String getUserName() {
        return userName;
    }
}

