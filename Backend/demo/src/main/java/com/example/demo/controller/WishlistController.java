package com.example.demo.controller;

import com.example.demo.entity.Wishlist;
import com.example.demo.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;


import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<String> addWishlist(@RequestParam String email , @RequestParam Long productId) {
        wishlistService.addToWishlist(email, productId);
        return ResponseEntity.ok("Product Added to Wishlist");
    }

    @GetMapping("/contains")
    public ResponseEntity<Boolean> isInWishlist(@RequestParam String email, @RequestParam Long productId) {
        boolean contains = wishlistService.isInWishlist(email, productId);
        return ResponseEntity.ok(contains);
    }

    @GetMapping("/{email}")
    public ResponseEntity<List<Wishlist>> getWishlistItems(@PathVariable String email) {
        List<Wishlist> wishlistItems = wishlistService.getWishlistItems(email);
        return ResponseEntity.ok(wishlistItems);
    }
    
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(@RequestParam String email, @RequestParam Long productId) {
        wishlistService.removeFromWishlist(email, productId);
        return ResponseEntity.ok("Product Removed from Wishlist");
    }
    
    @DeleteMapping("/clear/{email}")
    public ResponseEntity<String> clearWishlist(@PathVariable String email) {
        wishlistService.clearWishlist(email);
        return ResponseEntity.ok("Wishlist Cleared");
    }

    @PostMapping("/toggle-subscription")
    public ResponseEntity<String> toggleSubscription(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSubscribedToEmails(!user.isSubscribedToEmails());
        userRepository.save(user);
        return ResponseEntity.ok(user.isSubscribedToEmails()
                ? "Subscribed to email notifications."
                : "Unsubscribed from email notifications.");
    }

    @GetMapping("/subscription-status")
    public ResponseEntity<Boolean> getSubscriptionStatus(@RequestParam String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user.isSubscribedToEmails());
    }
}
