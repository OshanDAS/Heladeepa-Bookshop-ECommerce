package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.CartItem;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartItemRepository;
import com.example.demo.repository.ProductRepository;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    public List<CartItem> getCartItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String userId = String.valueOf(user.getId());
        return cartItemRepository.findByUserId(userId);
    }

    public CartItem addItem(Long productId, int quantity, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = new CartItem(product, quantity, String.valueOf(user.getId()));
        return cartItemRepository.save(cartItem);
    }

    public CartItem updateItem(Long id, int quantity) {
        CartItem item = cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(Long id) {
        cartItemRepository.deleteById(id);
    }
}
