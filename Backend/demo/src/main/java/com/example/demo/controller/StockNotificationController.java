package com.example.demo.controller;

import com.example.demo.dto.OrderAlertDTO;
import com.example.demo.dto.StockAlertDTO;
import com.example.demo.service.StockNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class StockNotificationController {
    private final StockNotificationService stockNotificationService;

    public StockNotificationController(StockNotificationService stockNotificationService) {
        this.stockNotificationService = stockNotificationService;
    }

    @PostMapping("/stock/subscribe")
    public String subscribeForStockNotification(@RequestParam String email , @RequestParam Long productId) {
        stockNotificationService.subscribeForNotification(email, productId);
        return "Subscribed Successfully , You will be notified via an email when stock is available";
    }

    @PostMapping("/stock/check-stock/{productId}")
    public String checkStock(@PathVariable Long productId) {
        stockNotificationService.notifyUsersIfStockAvailable(productId);
        return "Stock checked and notification sent if applicable";
    }

    // Admin: Update stock threshold for a product
    @PutMapping("/admin/stock/product/{productId}/threshold")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStockThreshold(
            @PathVariable Long productId,
            @RequestParam Integer threshold) {
        stockNotificationService.updateThreshold(productId, threshold);
        return ResponseEntity.ok("Threshold updated successfully.");
    }

    // Admin: Get low-stock alerts
    @GetMapping("/admin/stock/alerts/stock")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<StockAlertDTO>> getLowStockAlerts() {
        List<StockAlertDTO> alerts = stockNotificationService.getLowStockAlerts();
        return ResponseEntity.ok(alerts);
    }

    // Admin: Get recent order alerts
    @GetMapping("/admin/stock/alerts/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderAlertDTO>> getOrderAlerts() {
        List<OrderAlertDTO> alerts = stockNotificationService.getOrderAlerts();
        return ResponseEntity.ok(alerts);
    }
}
