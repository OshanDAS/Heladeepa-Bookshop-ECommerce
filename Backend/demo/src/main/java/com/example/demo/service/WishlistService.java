package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.entity.Wishlist;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;


    public void addToWishlist(String email , Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if(wishlistRepository.findByUserAndProduct(user, product).isEmpty()){
            Wishlist wishlist = new Wishlist(user, product);
            wishlistRepository.save(wishlist);
        }
    }


    public boolean isInWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return wishlistRepository.findByUserAndProduct(user, product).isPresent();
    }

    public List<Wishlist> getWishlistItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUser(user);
    }
    
    public void removeFromWishlist(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        Optional<Wishlist> wishlistItem = wishlistRepository.findByUserAndProduct(user, product);
        wishlistItem.ifPresent(wishlistRepository::delete);
    }
    
    public void clearWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Wishlist> wishlistItems = wishlistRepository.findByUser(user);
        wishlistRepository.deleteAll(wishlistItems);
    }

}
