package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, String> {
    Order findByOrderIdAndStatusAndUserId(String orderId, String status, long userId);
    Optional<Order> findByOrderId(String orderId);

    List<Order> findByUserId(long userId);

    List<Order> findByStatus(String status);

    List<Order> findAll();

    List<Order> findByCreatedAtAfter(LocalDateTime timestamp);

}
