package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.CartItem;
import com.example.demo.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable String userId) {
        return cartService.getCartItems(userId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long productId, @RequestParam int quantity, @RequestParam String email) {
        return cartService.addItem(productId, quantity, email);
    }

    @PutMapping("/update/{id}")
    public CartItem updateCartItem(@PathVariable Long id, @RequestParam int quantity) {
        return cartService.updateItem(id, quantity);
    }

    @DeleteMapping("/remove/{id}")
    public void removeCartItem(@PathVariable Long id) {
        cartService.removeItem(id);
    }
}
