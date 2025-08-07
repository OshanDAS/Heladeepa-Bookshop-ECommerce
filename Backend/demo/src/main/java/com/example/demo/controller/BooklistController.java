package com.example.demo.controller;

import com.example.demo.entity.BookItem;
import com.example.demo.entity.Booklist;
import com.example.demo.entity.User;
import com.example.demo.repository.BooklistRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;

import com.example.demo.service.CloudinaryService;
import com.example.demo.service.OCRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/booklists")
@CrossOrigin(origins = "http://localhost:5173")
public class BooklistController {

    @Autowired
    private BooklistRepository booklistRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OCRService ocrService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private UserRepository userRepository;


    @GetMapping("/my/{email}")
    public List<Booklist> getMyBooklists(@PathVariable String email) {
        return booklistRepository.findByCustomerEmail(email);
    }

    @PostMapping("/add")
    public Booklist addBooklist(@RequestBody Booklist booklist) {
        User user = userRepository.findByEmail(booklist.getCustomerEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        booklist.setUser(user);
        booklist.setStatus(Booklist.BooklistStatus.PENDING);
        booklist.setSubmittedDate(LocalDateTime.now());
        return booklistRepository.save(booklist);
    }

    @PostMapping("/upload-image/{id}")
    public ResponseEntity<?> uploadImage(@PathVariable Long id, @RequestParam("image") MultipartFile image) {
        try {
            System.out.println("Received image upload request for booklist ID: " + id);
            System.out.println("Image content type: " + image.getContentType());
            System.out.println("Image size: " + image.getSize());

            Booklist booklist = booklistRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Booklist not found"));

            System.out.println("Found booklist: " + booklist.getName());

            String imageUrl = cloudinaryService.uploadImage(image);
            System.out.println("Uploaded to Cloudinary, URL: " + imageUrl);

            booklist.setImageUrl(imageUrl);
            booklistRepository.save(booklist);

            return ResponseEntity.ok().body(imageUrl);
        } catch (Exception e) {
            System.err.println("Error uploading image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error uploading image: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public Booklist updateBooklist(@PathVariable Long id, @RequestBody Booklist updated) {
        Booklist booklist = booklistRepository.findById(id).orElseThrow();
        booklist.setName(updated.getName());
        booklist.setBooks(updated.getBooks());
        return booklistRepository.save(booklist);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteBooklist(@PathVariable Long id) {
        booklistRepository.deleteById(id);
    }

    @PostMapping("/submit/{id}")
    public Booklist submitBooklist(@PathVariable Long id) {
        Booklist booklist = booklistRepository.findById(id).orElseThrow();
        booklist.setStatus(Booklist.BooklistStatus.SUBMITTED);
        booklistRepository.save(booklist);

        // Send email with image
        emailService.sendBooklistSubmissionNotification(booklist);


        return booklist;
    }

    @PutMapping("/admin/status/{id}")
    public Booklist updateStatus(@PathVariable Long id, @RequestParam String status) {
        Booklist booklist = booklistRepository.findById(id).orElseThrow();
        booklist.setStatus(Booklist.BooklistStatus.valueOf(status));
        booklistRepository.save(booklist);

        // Send email with image
        emailService.sendBooklistStatusUpdateNotification(booklist);


        return booklist;
    }
    @GetMapping("/admin/all")
    public List<Booklist> getAllBooklists() {
        return booklistRepository.findAll();
    }


    @PostMapping("/ocr-upload")
    public ResponseEntity<?> handleOcrUpload(
            @RequestParam("image") MultipartFile file,
            @RequestParam("email") String customerEmail,
            @RequestParam("name") String name
    ) {
        try {
            User user = userRepository.findByEmail(customerEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // First, upload the image to Cloudinary
            String imageUrl = cloudinaryService.uploadImage(file);
            System.out.println("Image uploaded to Cloudinary: " + imageUrl);

            // Then process OCR
            String extractedText = ocrService.extractText(file);
            if (extractedText == null || extractedText.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("No text could be extracted from the image");
            }

            List<BookItem> parsedItems = ocrService.parseBookItems(extractedText);
            if (parsedItems.isEmpty()) {
                return ResponseEntity.badRequest().body("No book items could be parsed from the extracted text");
            }

        Booklist booklist = new Booklist();
        booklist.setName(name);
        booklist.setCustomerEmail(customerEmail);
        booklist.setBooks(parsedItems);
        booklist.setStatus(Booklist.BooklistStatus.PENDING);
        booklist.setSubmittedDate(LocalDateTime.now());
        booklist.setUser(user);
        booklist.setImageUrl(imageUrl);

            Booklist saved = booklistRepository.save(booklist);

            // Send notification to admin with image
            emailService.sendAdminBooklistNotification(saved);

            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing image: " + e.getMessage());
        }
    }
}