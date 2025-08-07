package com.example.demo.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "booklists")
public class Booklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;

    private String imageUrl;


    @ElementCollection
    @CollectionTable(name = "booklist_books", joinColumns = @JoinColumn(name = "booklist_id"))
    private List<BookItem> books;

    @Enumerated(EnumType.STRING)
    private BooklistStatus status;
    // Example values: PENDING, SUBMITTED, IN_REVIEW, COMPLETED

    private String customerEmail;

    private LocalDateTime submittedDate;


    public enum BooklistStatus {
        PENDING,
        SUBMITTED,
        IN_REVIEW,
        COMPLETED
    }


    // Constructors
    public Booklist() {
    }

    public Booklist(String name, List<BookItem> books, BooklistStatus status, String customerEmail, LocalDateTime submittedDate, String imageUrl, User user) {
        this.name = name;
        this.books = books;
        this.status = status;
        this.customerEmail = customerEmail;
        this.submittedDate = submittedDate;
        this.imageUrl = imageUrl;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<BookItem> getBooks() {
        return books;
    }

    public void setBooks(List<BookItem> books) {
        this.books = books;
    }


    public BooklistStatus getStatus() {
        return status;
    }

    public void setStatus(BooklistStatus status) {
        this.status = status;
    }


    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public LocalDateTime getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDateTime submittedDate) {
        this.submittedDate = submittedDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}