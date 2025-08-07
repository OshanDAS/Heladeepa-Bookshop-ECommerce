package com.example.demo.dto;

import java.util.ArrayList;
import java.util.List;

public class FileValidationResult {
    private boolean valid = true;
    private List<RowError> errors = new ArrayList<>();

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public List<RowError> getErrors() {
        return errors;
    }

    public void addError(RowError error) {
        this.valid = false;
        this.errors.add(error);
    }

    public void addError(int rowNumber, String message) {
        this.valid = false;
        this.errors.add(new RowError(rowNumber, message));
    }
}