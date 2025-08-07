package com.example.demo.controller;

import com.example.demo.dto.OrderProductDTO;
import com.example.demo.dto.OrderResponseDTO;
import com.example.demo.entity.Order;
import com.example.demo.entity.User;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderService orderService;



    // Get orders for a user based on their email
    @GetMapping("/user/{email}")
    public List<OrderResponseDTO> getOrdersByUser(@PathVariable String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderRepository.findByUserId(user.getId()); // fetch orders

        List<OrderResponseDTO> orderResponseDTOs = orders.stream().map(order -> {
            OrderResponseDTO dto = new OrderResponseDTO();
            dto.setOrderId(order.getOrderId());
            dto.setAmount(order.getAmount());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedAt().toString());
            dto.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);
            dto.setUserId(order.getUser().getId()); // Only user ID

            List<OrderProductDTO> productDTOs = order.getOrderProducts().stream().map(orderProduct -> {
                OrderProductDTO productDTO = new OrderProductDTO();
                productDTO.setProductId(orderProduct.getProduct().getId());
                productDTO.setProductName(orderProduct.getProduct().getName());
                productDTO.setPrice(orderProduct.getPrice());
                productDTO.setQuantity(orderProduct.getQuantity());
                return productDTO;
            }).collect(Collectors.toList());

            dto.setOrderProducts(productDTOs);

            return dto;
        }).collect(Collectors.toList());

        return orderResponseDTOs;
    }





    // Get all orders (for admin dashboard)
    @GetMapping("/admin")
    public List<OrderResponseDTO> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return orders.stream().map(order -> {
            OrderResponseDTO dto = new OrderResponseDTO();
            dto.setOrderId(order.getOrderId());
            dto.setAmount(order.getAmount());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedAt().toString());
            dto.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);
//            dto.setUserId(order.getUser().getId());
            User user = userRepository.findById(order.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));
            dto.setUserName(user.getName());

            // Add products in the order
            dto.setOrderProducts(order.getOrderProducts().stream().map(orderProduct -> {
                OrderProductDTO productDTO = new OrderProductDTO();
                productDTO.setProductId(orderProduct.getProduct().getId());
                productDTO.setProductName(orderProduct.getProduct().getName());
                productDTO.setPrice(orderProduct.getPrice());
                productDTO.setQuantity(orderProduct.getQuantity());
                return productDTO;
            }).collect(Collectors.toList()));

            return dto;
        }).collect(Collectors.toList());
    }







    // Get a specific order by its order number
    @GetMapping("/{orderNumber}")
    public ResponseEntity<OrderResponseDTO> getOrderByNumber(@PathVariable String orderNumber) {
        try {
            logger.info("Fetching order: {}", orderNumber);

            Optional<Order> orderOpt = orderRepository.findByOrderId(orderNumber);

            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOpt.get();

            // Map the order to a DTO to return only the necessary fields
            OrderResponseDTO orderResponseDTO = new OrderResponseDTO();
            orderResponseDTO.setOrderId(order.getOrderId());
            orderResponseDTO.setAmount(order.getAmount());
            orderResponseDTO.setStatus(order.getStatus());
            orderResponseDTO.setCreatedAt(order.getCreatedAt().toString());
            orderResponseDTO.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);
            orderResponseDTO.setUserId(order.getUser().getId()); // Example: returning only user ID
            User user = userRepository.findById(order.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));
            orderResponseDTO.setUserName(user.getName());

            // Set other fields like products, etc.
            List<OrderProductDTO> productDTOs = order.getOrderProducts().stream().map(orderProduct -> {
                OrderProductDTO productDTO = new OrderProductDTO();
                productDTO.setProductId(orderProduct.getProduct().getId());
                productDTO.setProductName(orderProduct.getProduct().getName());
                productDTO.setPrice(orderProduct.getPrice());
                productDTO.setQuantity(orderProduct.getQuantity());
                productDTO.setImgUrl(orderProduct.getProduct().getImageUrl());
                return productDTO;
            }).collect(Collectors.toList());

            orderResponseDTO.setOrderProducts(productDTOs);

            return ResponseEntity.ok(orderResponseDTO);

        } catch (Exception e) {
            logger.error("Error fetching order {}: {}", orderNumber, e.getMessage(), e);
            return ResponseEntity.notFound().build();
        }
    }





    // Update order status
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable String orderId, @RequestParam String status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        if (updatedOrder != null) {
            return ResponseEntity.ok("Order status updated successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Get orders by status (for filtering)
    @GetMapping("/status/{status}")
    public List<OrderResponseDTO> getOrdersByStatus(@PathVariable String status) {
        List<Order> orders = orderService.getOrdersByStatus(status);
        return orders.stream().map(order -> {
            OrderResponseDTO dto = new OrderResponseDTO();
            dto.setOrderId(order.getOrderId());
            dto.setAmount(order.getAmount());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedAt().toString());
            dto.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);
            dto.setUserId(order.getUser().getId());
            User user = userRepository.findById(order.getUser().getId()).orElseThrow(() -> new RuntimeException("User not found"));
            dto.setUserName(user.getName());
            return dto;
        }).collect(Collectors.toList());
    }

    // Get recent orders (last 7 days)
    @GetMapping("/recent")
    public List<OrderResponseDTO> getRecentOrders() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        List<Order> orders = orderRepository.findByCreatedAtAfter(sevenDaysAgo);

        return orders.stream().map(order -> {
            OrderResponseDTO dto = new OrderResponseDTO();
            dto.setOrderId(order.getOrderId());
            dto.setAmount(order.getAmount());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedAt().toString());
            dto.setUpdatedAt(order.getUpdatedAt() != null ? order.getUpdatedAt().toString() : null);
            dto.setUserId(order.getUser().getId());
            dto.setUserName(order.getUser().getName());

            dto.setOrderProducts(order.getOrderProducts().stream().map(orderProduct -> {
                OrderProductDTO productDTO = new OrderProductDTO();
                productDTO.setProductId(orderProduct.getProduct().getId());
                productDTO.setProductName(orderProduct.getProduct().getName());
                productDTO.setPrice(orderProduct.getPrice());
                productDTO.setQuantity(orderProduct.getQuantity());
                return productDTO;
            }).collect(Collectors.toList()));

            return dto;
        }).collect(Collectors.toList());
    }
}



