package com.example.demo.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class BookItem {
    private String title;

    private int  quantity = 1;

    public BookItem(String title, int quantity) {
        this.title = title;
        this.quantity = quantity;
    }
    public BookItem() {
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
