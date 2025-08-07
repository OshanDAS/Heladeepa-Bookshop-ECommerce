package com.example.demo.repository;

import com.example.demo.entity.Product;
import com.example.demo.entity.StockNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockNotificationRepository extends JpaRepository<StockNotification, Long> {
    List<StockNotification> findByProductAndNotifiedFalse(Product product);

    Optional<StockNotification> findByEmailAndProduct(String email, Product product);
}
