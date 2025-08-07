package com.example.demo.controller;

import com.example.demo.dto.PreOrderDTO;
import com.example.demo.service.PreOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pre-orders")
@CrossOrigin
public class PreOrderController {

    @Autowired
    private PreOrderService preOrderService;
    
    /**
     * Create a new pre-order
     */
    @PostMapping("/create")
    public ResponseEntity<PreOrderDTO> createPreOrder(
            @RequestParam String email,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        try {
            PreOrderDTO preOrderDTO = preOrderService.createPreOrder(email, productId, quantity);
            return ResponseEntity.ok(preOrderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get all pre-orders for a user
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<List<PreOrderDTO>> getUserPreOrders(@PathVariable String email) {
        try {
            List<PreOrderDTO> preOrders = preOrderService.getUserPreOrders(email);
            return ResponseEntity.ok(preOrders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Check if a user has pre-ordered a product
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> hasUserPreOrderedProduct(
            @RequestParam String email,
            @RequestParam Long productId) {
        try {
            boolean hasPreOrdered = preOrderService.hasUserPreOrderedProduct(email, productId);
            return ResponseEntity.ok(Map.of("hasPreOrdered", hasPreOrdered));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Cancel a pre-order
     */
    @DeleteMapping("/cancel/{preOrderId}")
    public ResponseEntity<String> cancelPreOrder(
            @PathVariable Long preOrderId,
            @RequestParam String email) {
        try {
            preOrderService.cancelPreOrder(preOrderId, email);
            return ResponseEntity.ok("Pre-order cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get pre-order by ID
     */
    @GetMapping("/{preOrderId}")
    public ResponseEntity<PreOrderDTO> getPreOrderById(@PathVariable Long preOrderId) {
        try {
            PreOrderDTO preOrderDTO = preOrderService.getPreOrderById(preOrderId);
            return ResponseEntity.ok(preOrderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Add this to your existing PreOrderController
@PostMapping("/process-released")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<String> processReleasedPreOrders() {
    preOrderService.processReleasedPreOrders();
    return ResponseEntity.ok("Released pre-orders processed successfully");
}
}
