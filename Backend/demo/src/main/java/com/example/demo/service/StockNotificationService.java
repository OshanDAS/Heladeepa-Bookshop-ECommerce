package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.entity.StockNotification;
import com.example.demo.entity.User;
import com.example.demo.repository.*;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.example.demo.dto.OrderAlertDTO;
import com.example.demo.dto.StockAlertDTO;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.StockNotificationRepository;
import com.example.demo.repository.UserRepository;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class StockNotificationService {
    private final StockNotificationRepository stockNotificationRepository;
    private final ProductRepository productRepository;
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public StockNotificationService(StockNotificationRepository stockNotificationRepository, ProductRepository productRepository, JavaMailSender mailSender, UserRepository userRepository, OrderRepository orderRepository) {
        this.stockNotificationRepository = stockNotificationRepository;
        this.productRepository = productRepository;
        this.mailSender = mailSender;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public void subscribeForNotification(String email, Long productId) {
        // Check if the product exists
        Optional<Product> product = productRepository.findById(productId);
        product.ifPresent(product1 -> {
            // Check if the user is already subscribed for this product
            Optional<StockNotification> existingSubscription = stockNotificationRepository.findByEmailAndProduct(email, product1);

            // If not already subscribed, save the new subscription
            if (existingSubscription.isEmpty()) {
                StockNotification stockNotification = new StockNotification();
                stockNotification.setEmail(email);
                stockNotification.setProduct(product1);
                stockNotificationRepository.save(stockNotification);
            }
        });
    }

    @Transactional
    public void notifyUsersIfStockAvailable(Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        if (productOpt.isPresent()) {
            Product product = productOpt.get();

            if (product.getStock() > 0) { // Ensure stock is available
                List<StockNotification> notifications = stockNotificationRepository.findByProductAndNotifiedFalse(product);

                for (StockNotification notification : notifications) {
                    sendEmail(notification.getEmail(), product.getId());
                    notification.setNotified(true); // Mark as notified
                    stockNotificationRepository.save(notification);

                    // Remove the notification after sending the email
                    stockNotificationRepository.delete(notification);
                }
            }
        }
    }

    private void sendEmail(String email, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String productName = product.getName();
        String userName = user.getName();
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(email);
            helper.setSubject(productName + " Back on stock !!!");
            helper.setText("Good news " + userName + " The product you marked is now in stock, hurry up!!");
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    // Admin functionality
    public void updateThreshold(Long productId, Integer threshold) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setStockThreshold(threshold);
        productRepository.save(product);
    }

    public List<StockAlertDTO> getLowStockAlerts() {
        List<Product> lowStockProducts = productRepository.findByStockLessThanThreshold();
        return lowStockProducts.stream()
                .map(p -> new StockAlertDTO(p.getId(), p.getName(), p.getStock(), p.getStockThreshold()))
                .toList();
    }

    public List<OrderAlertDTO> getOrderAlerts() {
        LocalDateTime recent = LocalDateTime.now().minusHours(24); // Last 24 hours
        List<Order> recentOrders = orderRepository.findByCreatedAtAfter(recent);
        return recentOrders.stream()
                .map(o -> new OrderAlertDTO(
                        o.getOrderId(),
                        o.getUser().getName(),
                        o.getCreatedAt(),
                        o.getOrderProducts()))
                .toList();
    }

}

