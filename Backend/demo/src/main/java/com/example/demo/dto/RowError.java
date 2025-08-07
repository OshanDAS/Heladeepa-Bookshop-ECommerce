package com.example.demo.dto;

public class RowError {
    private int rowNumber;
    private String message;

    public RowError(int rowNumber, String message) {
        this.rowNumber = rowNumber;
        this.message = message;
    }

    public int getRowNumber() {
        return rowNumber;
    }

    public void setRowNumber(int rowNumber) {
        this.rowNumber = rowNumber;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}