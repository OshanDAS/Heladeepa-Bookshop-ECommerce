package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @Column(name = "order_id")
    private String orderId;

    @Column(name = "amount")
    private double amount;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id" , nullable = false)
    @JsonBackReference
    private User user;

    @OneToMany(mappedBy = "order" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<OrderProduct> orderProducts = new ArrayList<>();

    public Order() {
    }

    public Order(String orderId, double amount, String status, User user) {
        this.orderId = orderId;
        this.amount = amount;
        this.status = status;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<OrderProduct> getOrderProducts() {
        return orderProducts;
    }

    public void setOrderProducts(List<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }
    public void addProduct(Product product, int quantity, double price) {
        OrderProduct orderProduct = new OrderProduct(this, product, quantity, price);
        orderProducts.add(orderProduct);
    }


    // Method to update the status of the order
    public void updateStatus(String newStatus) {
        this.status = newStatus;
        this.updatedAt = LocalDateTime.now();  // Update the timestamp when the status is changed
    }
}
