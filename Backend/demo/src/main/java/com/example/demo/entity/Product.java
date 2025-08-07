package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String imageUrl;
    private double price;
    private int stock;
    private String author;      // Added field for author
    private String publisher;   // Added field for publisher
    private LocalDate releaseDate;
    private boolean preOrderAvailable;
    private int preOrderedQuantity; // Track total pre-ordered units



    private String barcode;

    private Integer stockThreshold;


    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonManagedReference
    private Category category;

    // Constructors
    public Product() {
    }

    public Product(String name, String description, String imageUrl, double price, int stock, Category category) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.stock = stock;
        this.author = author;
        this.publisher = publisher;
        this.category = category;
        this.preOrderedQuantity = 0;

    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }


    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }


    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public LocalDate getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }

    public boolean isPreOrderAvailable() {
        return preOrderAvailable;
    }

    public void setPreOrderAvailable(boolean preOrderAvailable) {
        this.preOrderAvailable = preOrderAvailable;
    }

    public int getPreOrderedQuantity() {
        return preOrderedQuantity;
    }

    public void setPreOrderedQuantity(int preOrderedQuantity) {
        this.preOrderedQuantity = preOrderedQuantity;
    }


// Helper method to check if a product is available for pre-order
    public boolean isAvailableForPreOrder() {
        return preOrderAvailable && releaseDate != null && releaseDate.isAfter(LocalDate.now());
    }

    // Helper method to increment pre-ordered quantity
    public void incrementPreOrderedQuantity(int quantity) {
        this.preOrderedQuantity += quantity;
    }

    // Helper method to decrement pre-ordered quantity
    public void decrementPreOrderedQuantity(int quantity) {
        this.preOrderedQuantity = Math.max(0, this.preOrderedQuantity - quantity);
    }


    public Integer getStockThreshold() {
        return stockThreshold;
    }

    public void setStockThreshold(Integer stockThreshold) {
        this.stockThreshold = stockThreshold;
    }

    // toString Method
    @Override
    public String toString() {
        return "Product{id=" + id + ", name='" + name + "', description='" + description + "', imageUrl='" + imageUrl + "', price=" + price + ", stock=" + stock + "}";
    }

    // equals and hashCode (using only 'id' for simplicity)
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Product product = (Product) obj;
        return id != null && id.equals(product.id);
    }

    @Override
    public int hashCode() {
        return 31;
    }
}
