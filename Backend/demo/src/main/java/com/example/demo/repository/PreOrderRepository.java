package com.example.demo.repository;

import com.example.demo.entity.PreOrder;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface PreOrderRepository extends JpaRepository<PreOrder, Long> {
    
    List<PreOrder> findByUser(User user);
    
    List<PreOrder> findByProduct(Product product);
    
    Optional<PreOrder> findByUserAndProduct(User user, Product product);
    
    Optional<PreOrder> findByUserAndProductAndStatus(User user, Product product, PreOrder.PreOrderStatus status);
    
    List<PreOrder> findByStatusAndProductReleaseDateLessThanEqual(
        PreOrder.PreOrderStatus status, LocalDate date);
    
    @Query("SELECT p FROM PreOrder p WHERE p.product.releaseDate <= :today AND p.status = 'PENDING' AND p.notificationSent = false")
    List<PreOrder> findReleasedPreOrders(@Param("today") LocalDate today);
    
    @Query("SELECT COUNT(p) FROM PreOrder p WHERE p.product.id = :productId AND p.status = 'PENDING'")
    int countPendingPreOrdersByProductId(@Param("productId") Long productId);
    
    @Query("SELECT SUM(p.quantity) FROM PreOrder p WHERE p.product.id = :productId AND p.status = 'PENDING'")
    Integer sumPendingPreOrderQuantitiesByProductId(@Param("productId") Long productId);
}
