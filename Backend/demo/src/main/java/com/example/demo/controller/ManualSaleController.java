package com.example.demo.controller;

import com.example.demo.dto.ManualSalesRequest;
import com.example.demo.entity.ManualSale;
import com.example.demo.service.ManualSaleService;
import com.example.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/manual-sales")
@CrossOrigin // Or restrict to your frontend domain
public class ManualSaleController {

    @Autowired
    private ManualSaleService manualSaleService;
    @Autowired
    private ProductService productService;

    @PostMapping
    public ManualSale createManualSale(@RequestBody ManualSalesRequest request) {
        return manualSaleService.createManualSale(request);
    }

    @PostMapping("/populate-barcodes")
    public ResponseEntity<String> populateBarcodes() {
        productService.assignDummyBarcodes();
        return ResponseEntity.ok("Barcodes assigned.");
    }

}
