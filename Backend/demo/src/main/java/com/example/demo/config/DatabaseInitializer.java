package com.example.demo.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.logging.Level;
import java.util.logging.Logger;

@Component
public class DatabaseInitializer {
    
    private static final Logger logger = Logger.getLogger(DatabaseInitializer.class.getName());
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @PostConstruct
    public void initialize() {
        logger.info("Checking and updating database schema for product filters...");
        try {
            // Check if columns exist before adding them
            if (!columnExists("product", "author")) {
                logger.info("Adding 'author' column to product table");
                jdbcTemplate.execute("ALTER TABLE product ADD COLUMN author VARCHAR(255)");
            }
            
            if (!columnExists("product", "publisher")) {
                logger.info("Adding 'publisher' column to product table");
                jdbcTemplate.execute("ALTER TABLE product ADD COLUMN publisher VARCHAR(255)");
            }
            
            logger.info("Database schema update completed successfully");
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error updating database schema: " + e.getMessage(), e);
        }
    }
    
    private boolean columnExists(String tableName, String columnName) {
        try {
            String query = "SELECT COUNT(*) FROM information_schema.columns " +
                          "WHERE table_name = ? AND column_name = ? AND table_schema = DATABASE()";
            Integer count = jdbcTemplate.queryForObject(query, Integer.class, tableName, columnName);
            return count != null && count > 0;
        } catch (Exception e) {
            logger.log(Level.WARNING, "Error checking if column exists: " + e.getMessage(), e);
            return false;
        }
    }
}