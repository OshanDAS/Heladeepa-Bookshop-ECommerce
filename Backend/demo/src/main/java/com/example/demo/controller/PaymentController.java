package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.entity.Promotion;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.PromotionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.User;

import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payhere")
public class PaymentController {
    @Value("${payhere.merchant.id}")
    private String merchantId;

    @Value("${payhere.merchant.secret}")
    private String merchantSecret;

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PromotionRepository promotionRepository;
    private final EmailService emailService;


    public PaymentController(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, PromotionRepository promotionRepository, EmailService emailService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.promotionRepository = promotionRepository;
        this.emailService = emailService;
    }

    @PostMapping("/create-payment")
    public Map<String , Object> createPayment(@RequestBody Map<String , Object> paymentData){
        String email = (String) paymentData.get("email");

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> products = (List<Map<String, Object>>) paymentData.get("products");
        if (products == null || products.isEmpty()) {
            throw new RuntimeException("No products specified");
        }
        String discountCode = (String) paymentData.get("discount_code");
//        Integer shippingCost = (Integer) paymentData.get("shipping");
            int shippingCost = 50;
        Promotion promo = promotionRepository.findByCode(discountCode);
        if (promo == null) {
            throw new RuntimeException("Invalid discount code: " + discountCode);
        }

        if (promo.getStatus() != Promotion.Status.ACTIVE) {
            throw new RuntimeException("Promotion is not active");
        }

        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(promo.getStartDate()) || now.isAfter(promo.getExpiryDate())) {
            throw new RuntimeException("Promotion is not valid at this time");
        }


        List<OrderProductDetails> orderProducts = products.stream().map(p -> {
            Long productId = Long.valueOf(p.get("product_id").toString());
            int quantity = Integer.parseInt(p.get("quantity").toString());
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productId));
            if (product.getStock() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            return new OrderProductDetails(product, quantity, product.getPrice());
        }).toList();

        // Calculate total amount
        double totalAmount = orderProducts.stream()
                .mapToDouble(op -> op.price * op.quantity)
                .sum();

        double discount = totalAmount * (promo.getDiscountPercentage() / 100.0);
        double finalAmount = totalAmount+shippingCost-discount;

        // Store order

        String orderId = (String) paymentData.get("order_id");
        Order order = new Order(orderId, finalAmount, "Pending", user);
        orderProducts.forEach(op -> order.addProduct(op.product, op.quantity, op.price));
        orderRepository.save(order);

        Map<String, Object> response = new HashMap<>();
        response.put("merchant_id", merchantId);
        response.put("order_id", orderId);
        response.put("items", paymentData.get("items"));
        response.put("amount", finalAmount);
        response.put("currency", "LKR");
        response.put("first_name", paymentData.get("first_name"));
        response.put("last_name", paymentData.get("last_name"));
        response.put("email", paymentData.get("email"));
        response.put("phone", paymentData.get("phone"));
        response.put("address", paymentData.get("address"));
        response.put("city", paymentData.get("city"));
        response.put("country", "Sri Lanka");
        response.put("return_url", "https://heladeepa.store/return");
        response.put("cancel_url", "https://heladeepa.store/cart");
        response.put("notify_url", "https://2c33-111-223-189-218.ngrok-free.app/api/payhere/notify"); // You can adjust this
        String hash = generateHash(response);
        response.put("hash", hash);
        return response;
    }



    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String orderId) {
        Optional<Order> paymentOptional = orderRepository.findByOrderId(orderId);

        if (paymentOptional.isPresent()) {
            return ResponseEntity.ok(Map.of(
                    "order_id", paymentOptional.get().getOrderId(),
                    "status", paymentOptional.get().getStatus()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }


    private String generateHash(Map<String, Object> data) {
        String merchantId = (String) data.get("merchant_id");
        String orderId = (String) data.get("order_id");
        String amount = String.format("%.2f", Double.parseDouble(data.get("amount").toString()));
        String currency = (String) data.get("currency");

        try {
            // First, hash the merchantSecret
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] secretBytes = md.digest(merchantSecret.getBytes());
            StringBuilder secretHex = new StringBuilder();
            for (byte b : secretBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) secretHex.append('0');
                secretHex.append(hex);
            }

            String hashStr = merchantId + orderId + amount + currency + secretHex.toString().toUpperCase();
            byte[] hashBytes = md.digest(hashStr.getBytes());

            StringBuilder hashHex = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hashHex.append('0');
                hashHex.append(hex);
            }

            return hashHex.toString().toUpperCase();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }


    @PostMapping(value = "/notify", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public String handlePaymentNotification(HttpServletRequest request) throws IOException {
        Map<String, String[]> parameterMap = request.getParameterMap();

        String orderId = getParam(parameterMap, "order_id");
        String payhereAmount = getParam(parameterMap, "payhere_amount");
        String payhereCurrency = getParam(parameterMap, "payhere_currency");
        String statusCode = getParam(parameterMap, "status_code");
        String md5sig = getParam(parameterMap, "md5sig");

        String localMd5 = generateMd5Sig(merchantId, orderId, payhereAmount, payhereCurrency, statusCode, merchantSecret);

        if (localMd5.equalsIgnoreCase(md5sig) && "2".equals(statusCode)) {
            System.out.println("✅ Payment verified for order: " + orderId);
            updateOrderStatus(orderId,"Paid");
            Order order = orderRepository.findByOrderId(orderId).orElseThrow(() -> new RuntimeException("Order not found"));
            emailService.sendOrderConfirmationEmail(order);
            emailService.sendAdminOrderConfirmationEmail(order);
        } else {
            System.out.println("❌ Payment verification failed for order: " + orderId);
            updateOrderStatus(orderId,"Payment Failed");
        }

        return "OK";
    }

    private void updateOrderStatus(String orderId, String status) {
        // Fetch the order from the database
        Optional<Order> optionalOrder = orderRepository.findByOrderId(orderId);

        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get(); // Unwrap the Optional

            // Update the order status
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now()); // Optionally, update the `updatedAt` field
            orderRepository.save(order); // Save the updated order

            System.out.println("Order status updated to: " + status);
        } else {
            System.out.println("Order not found for ID: " + orderId);
        }
    }


    private String getParam(Map<String, String[]> paramMap, String key) {
        return paramMap.containsKey(key) ? paramMap.get(key)[0] : "";
    }

    private String generateMd5Sig(String merchantId, String orderId, String amount, String currency, String status, String secret) {
        String hashedSecret = md5(secret).toUpperCase();
        String rawString = merchantId + orderId + amount + currency + status + hashedSecret;
        return md5(rawString).toUpperCase();
    }

    private String md5(String input) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] array = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : array) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }



    // Helper class for processing products
    private static class OrderProductDetails {
        Product product;
        int quantity;
        double price;

        OrderProductDetails(Product product, int quantity, double price) {
            this.product = product;
            this.quantity = quantity;
            this.price = price;
        }
    }

    
     
}
