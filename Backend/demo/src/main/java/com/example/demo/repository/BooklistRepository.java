package com.example.demo.repository;

import  com.example.demo.entity.Booklist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BooklistRepository extends JpaRepository<Booklist, Long> {
    List<Booklist> findByCustomerEmail(String email);
}