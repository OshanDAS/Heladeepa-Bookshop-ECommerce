package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ManualSaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "manual_sale_id")
    @JsonBackReference
    private ManualSale manualSale;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    private double itemTotalAmount;

    // Getters and Setters
    public Long getId() { return id; }

    public ManualSale getManualSale() { return manualSale; }
    public void setManualSale(ManualSale manualSale) { this.manualSale = manualSale; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getItemTotalAmount() { return itemTotalAmount; }
    public void setItemTotalAmount(double itemTotalAmount) { this.itemTotalAmount = itemTotalAmount; }
}
