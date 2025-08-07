package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EmailService emailService;

    // Get all orders (for admin dashboard)
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get orders by status (for filtering)
    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    // Update order status
    public Order updateOrderStatus(String orderId, String status) {
        Order order = orderRepository.findByOrderId(orderId).orElse(null);

        if (order != null) {
            order.setStatus(status);
            sendOrderStatusEmail(order.getUser().getEmail(), orderId, status);
            return orderRepository.save(order); // Save updated order
        }

        return null; // Order not found
    }

    public void sendOrderStatusEmail(String toEmail, String orderId, String status) {
        String subject = "Update on Your Order #" + orderId;

        String htmlContent = """
        <html>
        <head>
            <style>
                .container {
                    font-family: Arial, sans-serif;
                    background-color: #f7f7f7;
                    padding: 20px;
                    border-radius: 8px;
                    max-width: 600px;
                    margin: auto;
                    color: #333;
                }
                .header {
                    background-color: #5D4037;
                    color: white;
                    padding: 15px;
                    text-align: center;
                    border-radius: 6px 6px 0 0;
                }
                .content {
                    padding: 20px;
                    background-color: white;
                    border-radius: 0 0 6px 6px;
                }
                .status {
                    font-size: 18px;
                    font-weight: bold;
                    color: #D4A373;
                }
                .footer {
                    font-size: 13px;
                    margin-top: 20px;
                    color: #888;
                    text-align: center;
                }
                .btn {
                    background-color: #8D6E63;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;
                    margin-top: 15px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Order Update</h2>
                </div>
                <div class="content">
                    <p>Hi there,</p>
                    <p>We wanted to let you know that your order <strong>#%s</strong> has been updated.</p>
                    <p class="status">Current Status: %s</p>
                    
                    <a href="https://yourshop.com/orders/%s" class="btn">View Your Order</a>

                    <p class="footer">
                        Thank you for shopping with us.<br>
                        The Bookshop Team
                    </p>
                </div>
            </div>
        </body>
        </html>
        """.formatted(orderId, status, orderId);

        emailService.sendHtmlEmail(toEmail, subject, htmlContent);
    }

    // Get an order by its order number (optional: could be refactored to controller)
    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderId(orderNumber).orElse(null);
    }
}
