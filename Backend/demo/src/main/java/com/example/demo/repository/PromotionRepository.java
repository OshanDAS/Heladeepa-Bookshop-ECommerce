package com.example.demo.repository;

import com.example.demo.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Find promotions by status (ACTIVE, INACTIVE)
    List<Promotion> findByStatus(Promotion.Status status);

    // Fetch expired promotions that are still active
    @Query("SELECT p FROM Promotion p WHERE p.expiryDate < :now AND p.status = 'ACTIVE'")
    List<Promotion> findExpiredActivePromotions(@Param("now") LocalDateTime now);

    // Find promotion by unique discount code
    Promotion findByCode(String code);
}
