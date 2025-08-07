package com.example.demo.service;

import com.example.demo.entity.*;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.demo.entity.OrderProduct;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String verificationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify Your Bookshop Account");
        message.setText("Thank you for registering!\n\nPlease click the link below to verify your account:\n"
                + verificationLink + "\n\nNote: This link will expire in 24 hours.");
        message.setFrom("heladeepas@gmail.com");

        mailSender.send(message);
    }

    //For the booklist
    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mailSender.send(msg);
    }

    public void sendHtmlEmail(String toEmail, String subject, String htmlContent) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // Enable HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendOrderConfirmationEmail(Order order) {
        double shippingCost = 50.00; // example shipping cost

        String subject = "Order Confirmation - " + order.getOrderId();

        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<!DOCTYPE html>");
        emailContent.append("<html><head>");
        emailContent.append("<meta charset='UTF-8'>");
        emailContent.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        emailContent.append("<style>");
        emailContent.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }");
        emailContent.append("h2 { color: #5D4037; }");
        emailContent.append("p { margin: 10px 0; }");
        emailContent.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
        emailContent.append("th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }");
        emailContent.append("th { background-color: #F5E6CA; color: #5D4037; }");
        emailContent.append(".footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; }");
        emailContent.append("@media (max-width: 600px) { table, th, td { font-size: 14px; } }");
        emailContent.append("</style>");
        emailContent.append("</head><body>");

        emailContent.append("<h2>Thank You for Your Order!</h2>");
        emailContent.append("<p>Dear ").append(order.getUser().getName()).append(",</p>");
        emailContent.append("<p>Your order has been successfully processed. You'll receive another email when your order ships.</p>");

        emailContent.append("<h3>Order Details</h3>");
        emailContent.append("<p><strong>Order Number:</strong> ").append(order.getOrderId()).append("</p>");
        emailContent.append("<p><strong>Order Date:</strong> ").append(order.getCreatedAt()).append("</p>");
        // You can calculate or provide estimated delivery based on logic or config
        emailContent.append("<p><strong>Estimated Delivery Date:</strong> ").append(order.getCreatedAt().plusDays(5)).append("</p>");

        emailContent.append("<table>");
        emailContent.append("<tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>");

        double subtotal = 0.0;

        for (OrderProduct op : order.getOrderProducts()) {
            double itemSubtotal = op.getPrice() * op.getQuantity();
            subtotal += itemSubtotal;

            emailContent.append("<tr>");
            emailContent.append("<td>").append(op.getProduct().getName()).append("</td>");
            emailContent.append("<td>").append(op.getQuantity()).append("</td>");
            emailContent.append("<td>Rs. ").append(String.format("%.2f", op.getPrice())).append("</td>");
            emailContent.append("<td>Rs. ").append(String.format("%.2f", itemSubtotal)).append("</td>");
            emailContent.append("</tr>");
        }

        emailContent.append("</table>");
        emailContent.append("<p><strong>Subtotal:</strong> Rs. ").append(String.format("%.2f", subtotal)).append("</p>");
        emailContent.append("<p><strong>Shipping:</strong> Rs. ").append(String.format("%.2f", shippingCost)).append("</p>");
        emailContent.append("<p><strong>Total Amount:</strong> Rs. ").append(String.format("%.2f", order.getAmount())).append("</p>");

        // Assuming shipping address and payment method are in User or elsewhere.
//        emailContent.append("<p><strong>Shipping Address:</strong> ").append(order.getUser().getAddress()).append("</p>");
        emailContent.append("<p><strong>Payment Status:</strong> ").append(order.getStatus()).append("</p>");

        emailContent.append("<div class='footer'>");
        emailContent.append("<p>Thank you for shopping with BookShop!</p>");
        emailContent.append("<p>Contact us at support@bookshop.com if you have any questions.</p>");
        emailContent.append("</div>");

        emailContent.append("</body></html>");
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(order.getUser().getEmail());
            helper.setSubject(subject);
            helper.setText(emailContent.toString(), true);
            helper.setFrom("heladeepas@gmail.com");

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace(); // or log it properly
        }

    }


    public void sendAdminOrderConfirmationEmail(Order order) {
        String subject = "New Order Placed - Order #" + order.getOrderId();

        StringBuilder emailContent = new StringBuilder();
        emailContent.append("<!DOCTYPE html>");
        emailContent.append("<html><head>");
        emailContent.append("<meta charset='UTF-8'>");
        emailContent.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        emailContent.append("<style>");
        emailContent.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }");
        emailContent.append("h2 { color: #5D4037; }");
        emailContent.append("p { margin: 10px 0; }");
        emailContent.append("table { width: 100%; border-collapse: collapse; margin: 20px 0; }");
        emailContent.append("th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }");
        emailContent.append("th { background-color: #F5E6CA; color: #5D4037; }");
        emailContent.append(".footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; }");
        emailContent.append("@media (max-width: 600px) { table, th, td { font-size: 14px; } }");
        emailContent.append("</style>");
        emailContent.append("</head><body>");

        emailContent.append("<h2>New Order Placed - Order #").append(order.getOrderId()).append("</h2>");
        emailContent.append("<p>A new order has been placed by ").append(order.getUser().getName()).append(".</p>");
        emailContent.append("<p><strong>Order Details:</strong></p>");

        // Add essential order details for admin to process
        emailContent.append("<table>");
        emailContent.append("<tr><th>Order Number</th><td>").append(order.getOrderId()).append("</td></tr>");
        emailContent.append("<tr><th>Customer Name</th><td>").append(order.getUser().getName()).append("</td></tr>");
        emailContent.append("<tr><th>Order Date</th><td>").append(order.getCreatedAt()).append("</td></tr>");
//        emailContent.append("<tr><th>Shipping Address</th><td>").append(order.getUser().getAddress()).append("</td></tr>");
        emailContent.append("<tr><th>Status</th><td>").append(order.getStatus()).append("</td></tr>");
        emailContent.append("<tr><th>Total Amount</th><td>Rs. ").append(String.format("%.2f", order.getAmount())).append("</td></tr>");
        emailContent.append("<tr><th>Estimated Delivery Date</th><td>").append(order.getCreatedAt().plusDays(5)).append("</td></tr>");
        emailContent.append("</table>");

        emailContent.append("<h3>Order Products:</h3>");
        emailContent.append("<table>");
        emailContent.append("<tr><th>Product Name</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>");

        double subtotal = 0.0;

        for (OrderProduct op : order.getOrderProducts()) {
            double itemSubtotal = op.getPrice() * op.getQuantity();
            subtotal += itemSubtotal;

            emailContent.append("<tr>");
            emailContent.append("<td>").append(op.getProduct().getName()).append("</td>");
            emailContent.append("<td>").append(op.getQuantity()).append("</td>");
            emailContent.append("<td>Rs. ").append(String.format("%.2f", op.getPrice())).append("</td>");
            emailContent.append("<td>Rs. ").append(String.format("%.2f", itemSubtotal)).append("</td>");
            emailContent.append("</tr>");
        }

        emailContent.append("</table>");
        emailContent.append("<p><strong>Subtotal:</strong> Rs. ").append(String.format("%.2f", subtotal)).append("</p>");
        emailContent.append("<p><strong>Shipping:</strong> Rs. 250.00</p>");
        emailContent.append("<p><strong>Total:</strong> Rs. ").append(String.format("%.2f", subtotal + 250.00)).append("</p>");

        emailContent.append("<div class='footer'>");
        emailContent.append("<p>Thank you for managing the BookShop orders!</p>");
        emailContent.append("<p>Contact us at support@bookshop.com if you have any questions.</p>");
        emailContent.append("</div>");

        emailContent.append("</body></html>");

        // Send email to admin
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("admin@bookshop.com"); // Change to your admin email address
        message.setSubject(subject);
        message.setText(emailContent.toString());
        message.setFrom("heladeepas@gmail.com"); // Change to the correct from address

        mailSender.send(message);
    }

    public void sendPreOrderUpdateEmail(String email, PreOrder preOrder) {
        
    }

    public void sendPreOrderConfirmationEmail(String email, PreOrder preOrder) {
    }

    public void sendPreOrderCancellationEmail(String email, PreOrder preOrder) {
    }

    public void sendPreOrderAvailableEmail(String email, PreOrder preOrder) {
    }

    public void sendBackInStockEmail(String toEmail, String productName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("📦 " + productName + " is Back in Stock!");

            String htmlContent = buildHtmlContent(productName);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String buildHtmlContent(String productName) {
        // Escape the productName to prevent HTML injection

        return """
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #333333;">Good news! 🎉</h2>
                <p style="font-size: 16px; color: #555555;">
                    The product you added to your wishlist, <strong>%s</strong>, is now <span style="color: #28a745;">back in stock</span>!
                </p>
                <p style="font-size: 16px; color: #555555;">Don't miss your chance to get it before it's gone again.</p>
                <a href="https://your-bookshop.com/wishlist" style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                    Go to Wishlist
                </a>
                <p style="margin-top: 30px; font-size: 12px; color: #999999;">You're receiving this email because you subscribed to product updates.</p>
            </div>
        </body>
    </html>
    """.formatted(productName);
    }

    // New method to send HTML email with booklist image
    public void sendBooklistNotificationEmail(String to, String subject, String message, String imageUrl) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom("heladeepas@gmail.com");

            // Create HTML content with the image
            String htmlContent = String.format("""
                <html>
                <head>
                    <style>
                        .email-container {
                            font-family: Arial, sans-serif;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .booklist-image {
                            max-width: 100%%;
                            height: auto;
                            margin: 20px 0;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .message {
                            color: #333;
                            line-height: 1.6;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="message">%s</div>
                        %s
                    </div>
                </body>
                </html>
                """,
                    message,
                    imageUrl != null ? "<img src='" + imageUrl + "' alt='Booklist Image' class='booklist-image' />" : ""
            );

            helper.setText(htmlContent, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email with image", e);
        }
    }

    // Method to send booklist submission notification
    public void sendBooklistSubmissionNotification(Booklist booklist) {
        String subject = "Booklist Submitted";
        String message = "Your booklist '" + booklist.getName() + "' has been successfully submitted to Heladeepa Bookshop! We will update you soon.";
        sendBooklistNotificationEmail(booklist.getCustomerEmail(), subject, message, booklist.getImageUrl());
    }

    // Method to send booklist status update notification
    public void sendBooklistStatusUpdateNotification(Booklist booklist) {
        String subject = "Booklist Status Updated";
        String message = "Your booklist '" + booklist.getName() + "' status has been updated to: " + booklist.getStatus();
        sendBooklistNotificationEmail(booklist.getCustomerEmail(), subject, message, booklist.getImageUrl());
    }

    public void sendAdminBooklistNotification(Booklist booklist) {
        String subject = "📚 New Booklist Submission Received";

        String message = String.format("""
        <div class="bg-gray-100 p-6 font-sans">
          <div class="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
            <div class="px-6 py-4">
              <h2 class="text-2xl font-bold text-blue-700 mb-4">📚 New Booklist Submission Received</h2>
              <p class="text-gray-800 mb-4">
                Hello Admin,
              </p>
              <p class="text-gray-700 mb-4">
                A new booklist has just been submitted. Please find the details below:
              </p>
              <ul class="text-gray-700 mb-4 list-disc list-inside space-y-1">
                <li><strong>Booklist Name:</strong> %s</li>
                <li><strong>Submitted By:</strong> %s</li>
                <li><strong>Current Status:</strong> %s</li>
                <li><strong>Date Submitted:</strong> %s</li>
              </ul>
              <p class="text-gray-700 mb-4">
                Please review it at your earliest convenience.
              </p>
              <p class="text-gray-800">
                Best regards,<br/>
                <span class="font-semibold">Heladeepa Bookshop System</span>
              </p>
            </div>
          </div>
        </div>
        """,
                booklist.getName(),
                booklist.getCustomerEmail(),
                booklist.getStatus(),
                booklist.getSubmittedDate()
        );


        sendBooklistNotificationEmail("heladeepas@gmail.com", subject, message, booklist.getImageUrl());
    }



}