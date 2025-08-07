package com.example.demo.dto;

import java.util.List;

public class ManualSalesRequest {

    private List<ManualSaleItemRequest> items;

    public List<ManualSaleItemRequest> getItems() {
        return items;
    }

    public void setItems(List<ManualSaleItemRequest> items) {
        this.items = items;
    }
}
