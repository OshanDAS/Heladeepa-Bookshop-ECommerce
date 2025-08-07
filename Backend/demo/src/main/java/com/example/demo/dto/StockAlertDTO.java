package com.example.demo.dto;

public class StockAlertDTO {
    private Long productId;
    private String productName;
    private Integer stock;
    private Integer stockThreshold;

    public StockAlertDTO(Long productId, String productName, Integer stock, Integer threshold) {
        this.productId = productId;
        this.productName = productName;
        this.stock = stock;
        this.stockThreshold = threshold;
    }

    // Getters and setters


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

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getStockThreshold() {
        return stockThreshold;
    }

    public void setStockThreshold(Integer stockThreshold) {
        this.stockThreshold = stockThreshold;
    }
}