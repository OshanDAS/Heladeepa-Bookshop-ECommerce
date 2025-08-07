package com.example.demo.service;

import com.example.demo.dto.StockAlertDTO;
import com.example.demo.dto.OrderAlertDTO;
import com.example.demo.entity.Product;
import com.example.demo.entity.Order;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    public List<StockAlertDTO> getLowStockAlerts() {
        List<Product> lowStockProducts = productRepository.findByStockLessThanThreshold();
        return lowStockProducts.stream()
                .map(p -> new StockAlertDTO(p.getId(), p.getName(), p.getStock(), p.getStockThreshold()))
                .collect(Collectors.toList());
    }

    public List<OrderAlertDTO> getRecentOrders(LocalDateTime since) {
        List<Order> recentOrders = orderRepository.findByCreatedAtAfter(since);
        return recentOrders.stream()
                .map(o -> new OrderAlertDTO(
                        o.getOrderId(),
                        o.getUser().getName(),
                        o.getCreatedAt(),
                        o.getOrderProducts()))
                .collect(Collectors.toList());
    }
}