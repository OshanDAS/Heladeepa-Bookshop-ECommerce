package com.example.demo.service;

import com.example.demo.dto.PreOrderDTO;
import com.example.demo.entity.PreOrder;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.PreOrderRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PreOrderService {

    private static final Logger logger = LoggerFactory.getLogger(PreOrderService.class);

    @Autowired
    private PreOrderRepository preOrderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private EmailService emailService;
    
    /**
     * Create a new pre-order
     */
    @Transactional
    public PreOrderDTO createPreOrder(String email, Long productId, int quantity) {
        // Validate user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Validate product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Check if product is available for pre-order
        if (!product.isAvailableForPreOrder()) {
            throw new RuntimeException("Product is not available for pre-order");
        }
        // Check if user already has an ACTIVE pre-order for this product
        Optional<PreOrder> existingActivePreOrder = preOrderRepository.findByUserAndProductAndStatus(
            user, product, PreOrder.PreOrderStatus.PENDING);
        
        if (existingActivePreOrder.isPresent()) {
            PreOrder preOrder = existingActivePreOrder.get();
            
            // Update existing pre-order
            int oldQuantity = preOrder.getQuantity();
            preOrder.setQuantity(quantity);
            
            // Update product's pre-ordered quantity
            product.decrementPreOrderedQuantity(oldQuantity);
            product.incrementPreOrderedQuantity(quantity);
            productRepository.save(product);
            
            // Save pre-order
            preOrderRepository.save(preOrder);
            
            // Send email
            emailService.sendPreOrderUpdateEmail(user.getEmail(), preOrder);
            
            return new PreOrderDTO(preOrder);
        }
        
        // Create new pre-order
        PreOrder preOrder = new PreOrder(user, product, quantity);
        
        // Update product's pre-ordered quantity
        product.incrementPreOrderedQuantity(quantity);
        productRepository.save(product);
        
        // Save pre-order
        preOrderRepository.save(preOrder);
        
        // Send email
        emailService.sendPreOrderConfirmationEmail(user.getEmail(), preOrder);
        
        return new PreOrderDTO(preOrder);
    }
    
    /**
     * Get all pre-orders for a user
     */
    public List<PreOrderDTO> getUserPreOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<PreOrder> preOrders = preOrderRepository.findByUser(user);
        
        return preOrders.stream()
                .map(PreOrderDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
 * Check if a user has pre-ordered a product
 */
public boolean hasUserPreOrderedProduct(String email, Long productId) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    
    Optional<PreOrder> preOrder = preOrderRepository.findByUserAndProductAndStatus(
        user, product, PreOrder.PreOrderStatus.PENDING);
    
    return preOrder.isPresent();
}
    
    /**
     * Cancel a pre-order
     */
    @Transactional
public void cancelPreOrder(Long preOrderId, String email) {
    // Validate user
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    
    // Validate pre-order
    PreOrder preOrder = preOrderRepository.findById(preOrderId)
            .orElseThrow(() -> new RuntimeException("Pre-order not found"));
    
    // Check if pre-order belongs to user
    if (preOrder.getUser().getId() != user.getId()) {
        throw new RuntimeException("Pre-order does not belong to user");
    }
    
    // Check if pre-order can be cancelled
    if (!preOrder.canBeCancelled()) {
        throw new RuntimeException("Pre-order cannot be cancelled");
    }
    
    // Update product's pre-ordered quantity
    Product product = preOrder.getProduct();
    product.decrementPreOrderedQuantity(preOrder.getQuantity());
    productRepository.save(product);
    
    // Update pre-order status
    preOrder.setStatus(PreOrder.PreOrderStatus.CANCELLED);
    preOrderRepository.save(preOrder);
    
    // Send email
    emailService.sendPreOrderCancellationEmail(user.getEmail(), preOrder);
}


    @PostConstruct
    public void onStartup() {
        logger.info("Running pre-order check on startup...");
        processReleasedPreOrders(); // This will run on startup
    }

    
  /**
 * Process released pre-orders (scheduled job)
 * Runs at midnight every day
 */
@Scheduled(cron = "0 0 0 * * ?")
@Transactional
public void processReleasedPreOrders() {
    LocalDate today = LocalDate.now();
    
    // Find all pre-orders for products whose release date has passed but are still in PENDING status
    List<PreOrder> releasedPreOrders = preOrderRepository.findByStatusAndProductReleaseDateLessThanEqual(
        PreOrder.PreOrderStatus.PENDING, today);
    
    for (PreOrder preOrder : releasedPreOrders) {
        // Update pre-order status to RELEASED
        preOrder.setStatus(PreOrder.PreOrderStatus.RELEASED);
        preOrder.setNotificationSent(true);
        
        // Save pre-order
        preOrderRepository.save(preOrder);
        
        // Send email notification
        emailService.sendPreOrderAvailableEmail(preOrder.getUser().getEmail(), preOrder);
        
        logger.info("Updated pre-order ID {} to RELEASED status", preOrder.getId());
    }
}  
    
    /**
     * Get pre-order by ID
     */
    public PreOrderDTO getPreOrderById(Long preOrderId) {
        PreOrder preOrder = preOrderRepository.findById(preOrderId)
                .orElseThrow(() -> new RuntimeException("Pre-order not found"));
        
        return new PreOrderDTO(preOrder);
    }
}
