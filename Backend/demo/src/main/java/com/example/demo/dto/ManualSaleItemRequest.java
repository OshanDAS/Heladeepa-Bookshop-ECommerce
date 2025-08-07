package com.example.demo.dto;

public class ManualSaleItemRequest {
    private Long productId;
    private int quantity;
    private double itemTotalAmount;

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getItemTotalAmount() {
        return itemTotalAmount;
    }

    public void setItemTotalAmount(double itemTotalAmount) {
        this.itemTotalAmount = itemTotalAmount;
    }
}
