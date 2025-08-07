package com.example.demo.repository;

import com.example.demo.entity.ManualSaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ManualSaleItemRepository extends JpaRepository<ManualSaleItem, Long> {
}
