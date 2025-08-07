package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class ManualSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime saleTime = LocalDateTime.now();

    private double totalAmount;


    @OneToMany(mappedBy = "manualSale", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ManualSaleItem> items;

    // Getters and Setters
    public Long getId() { return id; }

    public LocalDateTime getSaleTime() { return saleTime; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public List<ManualSaleItem> getItems() { return items; }
    public void setItems(List<ManualSaleItem> items) { this.items = items; }
}
