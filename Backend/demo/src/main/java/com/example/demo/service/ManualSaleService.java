package com.example.demo.service;

import com.example.demo.dto.ManualSaleItemRequest;
import com.example.demo.dto.ManualSalesRequest;
import com.example.demo.entity.ManualSale;
import com.example.demo.entity.ManualSaleItem;
import com.example.demo.entity.Product;
import com.example.demo.repository.ManualSaleRepository;
import com.example.demo.repository.ProductRepository;
import jakarta.persistence.Entity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ManualSaleService {

    @Autowired
    private ManualSaleRepository manualSaleRepository;

    @Autowired
    private ProductRepository productRepository;

    public ManualSale createManualSale(ManualSalesRequest request) {
        List<ManualSaleItem> saleItems = new ArrayList<>();

        double totalAmount = 0;

        ManualSale sale = new ManualSale();

        for (ManualSaleItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"+itemRequest.getProductId()));
            if (product.getStock() < itemRequest.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
            ManualSaleItem saleItem = new ManualSaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity());
            saleItem.setItemTotalAmount(itemRequest.getItemTotalAmount());
            saleItem.setManualSale(sale);
            saleItems.add(saleItem);
            totalAmount += itemRequest.getItemTotalAmount();


        }
        sale.setItems(saleItems);
        sale.setTotalAmount(totalAmount);
        return manualSaleRepository.save(sale);
    }

}
