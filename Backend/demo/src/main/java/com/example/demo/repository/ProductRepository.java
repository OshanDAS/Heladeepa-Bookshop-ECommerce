package com.example.demo.repository;


import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findAll(Pageable pageable);

    List<Product> findAllByCategoryId(Long categoryId);
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Product> searchProducts(String keyword);


    @Query("SELECT p FROM Product p WHERE p.barcode LIKE CONCAT(:input, '%') OR LOWER(p.name) LIKE LOWER(CONCAT('%', :input, '%'))")
    List<Product> searchByBarcodePrefixOrName(@Param("input") String input);




    // New methods for filtering
    
    // Filter by price range
    Page<Product> findByPriceBetween(double minPrice, double maxPrice, Pageable pageable);
    
    // Filter by category
    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);
    
    // Filter by author
    Page<Product> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
    
    // Filter by publisher
    Page<Product> findByPublisherContainingIgnoreCase(String publisher, Pageable pageable);
    
    // Filter by availability (in stock)
    Page<Product> findByStockGreaterThan(int stock, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);


    List<Product> findByCategoryNameIgnoreCase(String categoryName);

    @Query("SELECT p FROM Product p WHERE p.stock <= :stockLevel")
    List<Product> findByStockLessThanEqual(int stockLevel);

    Page<Product> findByStockLessThanEqual(int stock, Pageable pageable);


    Page<Product> findAllByCategoryId(Long categoryId, Pageable pageable);
    
    // Combined filters with dynamic query
    @Query("SELECT p FROM Product p WHERE " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:author IS NULL OR LOWER(p.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:publisher IS NULL OR LOWER(p.publisher) LIKE LOWER(CONCAT('%', :publisher, '%'))) AND " +
           "(:inStock IS NULL OR (p.stock > 0 AND :inStock = true) OR (p.stock = 0 AND :inStock = false))")
    Page<Product> findProductsWithFilters(
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("categoryId") Long categoryId,
            @Param("author") String author,
            @Param("publisher") String publisher,
            @Param("inStock") Boolean inStock,
            Pageable pageable);
    
    // Get distinct authors for filter dropdown
    @Query("SELECT DISTINCT p.author FROM Product p WHERE p.author IS NOT NULL ORDER BY p.author")
    List<String> findDistinctAuthors();
    
    // Get distinct publishers for filter dropdown
    @Query("SELECT DISTINCT p.publisher FROM Product p WHERE p.publisher IS NOT NULL ORDER BY p.publisher")
    List<String> findDistinctPublishers();

    // methods for pre-order functionality
    Page<Product> findByReleaseDateAfterAndPreOrderAvailableTrue(LocalDate date, Pageable pageable);

    Page<Product> findByReleaseDateBetweenOrderByReleaseDateDesc(LocalDate startDate, LocalDate endDate, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.releaseDate <= :today AND p.preOrderAvailable = true")
    List<Product> findReleasedPreOrderProducts(@Param("today") LocalDate today);

    // Fetch products with stock below their individual threshold
    @Query("SELECT p FROM Product p WHERE p.stockThreshold IS NOT NULL AND p.stock <= p.stockThreshold")
    List<Product> findByStockLessThanThreshold();

}


