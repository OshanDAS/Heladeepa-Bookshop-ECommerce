package com.example.demo.service;

import com.example.demo.dto.ProductFilterRequest;
import com.example.demo.entity.Category;
import com.example.demo.entity.Product;
import com.example.demo.entity.Wishlist;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.WishlistRepository;
import com.example.demo.dto.FileValidationResult;
import com.example.demo.dto.RowError;
import com.example.demo.entity.User;

import com.fasterxml.jackson.annotation.OptBoolean;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import com.example.demo.dto.ProductUpdateDTO;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;
    private final WishlistRepository wishlistRepository;
    private final EmailService emailService;


    private Category getCategoryByNameOrThrow(String categoryName) {
        return categoryRepository.findByName(categoryName)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryName));
    }

    private Product createProduct(String name, String description, String imageUrl, double price, int stock, String author, String publisher, String categoryName) {
        Category category = getCategoryByNameOrThrow(categoryName); // Fetch the category by name
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setPrice(price);
        product.setStock(stock);
        product.setAuthor(author);
        product.setPublisher(publisher);
        product.setCategory(category);

        return product;
    }


    @Autowired
    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, CloudinaryService cloudinaryService , WishlistRepository wishlistRepository , EmailService emailService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
        this.wishlistRepository = wishlistRepository;
        this.emailService = emailService;
    }

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    public List<Product> getProductsByCategory(Long categoryID) {
        return productRepository.findAllByCategoryId(categoryID);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }



    public List<Product> searchProductsByBarcodePrefix(String prefix) {
        return productRepository.searchByBarcodePrefixOrName(prefix);
    }


    // New methods for filtering

    public Page<Product> getProductsByPriceRange(double minPrice, double maxPrice, Pageable pageable) {
        return productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
    }

    public Page<Product> getProductsByAuthor(String author, Pageable pageable) {
        return productRepository.findByAuthorContainingIgnoreCase(author, pageable);
    }

    public Page<Product> getProductsByPublisher(String publisher, Pageable pageable) {
        return productRepository.findByPublisherContainingIgnoreCase(publisher, pageable);
    }

    public Page<Product> getProductsInStock(Pageable pageable) {
        return productRepository.findByStockGreaterThan(0, pageable);
    }

    public Page<Product> getFilteredProducts(ProductFilterRequest filterRequest) {
        int page = filterRequest.getPage() != null ? filterRequest.getPage() : 0;
        int size = filterRequest.getSize() != null ? filterRequest.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size);

        return productRepository.findProductsWithFilters(
                filterRequest.getMinPrice(),
                filterRequest.getMaxPrice(),
                filterRequest.getCategoryId(),
                filterRequest.getAuthor(),
                filterRequest.getPublisher(),
                filterRequest.getInStock(),
                pageable
        );
    }

    // Methods to get filter options for dropdowns

    public List<String> getAllAuthors() {
        return productRepository.findDistinctAuthors();
    }

    public List<String> getAllPublishers() {
        return productRepository.findDistinctPublishers();
    }


    private void parseCSV(InputStream is) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line;
        boolean isFirstLine = true;

        while ((line = reader.readLine()) != null) {
            if (isFirstLine) { // Skip header
                isFirstLine = false;
                continue;
            }

            String[] fields = line.split(",", -1); // Preserve empty fields

            if (fields.length < 8) continue; // Skip incomplete rows

            String name = fields[0].trim();
            String description = fields[1].trim();
            String imageUrl = fields[2].trim();
            double price = Double.parseDouble(fields[3].trim());
            int stock = Integer.parseInt(fields[4].trim());
            String author = fields[5].trim();
            String publisher = fields[6].trim();
            String categoryName = fields[7].trim();

            Product product = createProduct(name, description, imageUrl, price, stock, author, publisher, categoryName);
            productRepository.save(product);
        }
    }


    private void parseExcel(InputStream is) throws IOException {
        Workbook workbook = new XSSFWorkbook(is);
        Sheet sheet = workbook.getSheetAt(0);

        for (Row row : sheet) {
            if (row.getRowNum() == 0) continue; // Skip header

            String name = row.getCell(0).getStringCellValue().trim();
            String description = row.getCell(1).getStringCellValue().trim();
            String imageUrl = row.getCell(2).getStringCellValue().trim();
            double price = row.getCell(3).getNumericCellValue();
            int stock = (int) row.getCell(4).getNumericCellValue();
            String author = row.getCell(5).getStringCellValue().trim();
            String publisher = row.getCell(6).getStringCellValue().trim();
            String categoryName = row.getCell(7).getStringCellValue().trim();

            Product product = createProduct(name, description, imageUrl, price, stock, author, publisher, categoryName);
            productRepository.save(product);
        }

        workbook.close();
    }

    private void validateCSV(InputStream is, FileValidationResult result) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line;
        int rowNumber = 0;
        boolean isFirstLine = true;
        Map<String, Integer> headerIndexMap = new HashMap<>();

        List<String> validCategories = Arrays.asList("Fiction", "Non-fiction", "Science", "History", "Technology");

        while ((line = reader.readLine()) != null) {
            rowNumber++;
            String[] fields = line.split(",", -1); // Preserve empty fields

            if (isFirstLine) {
                for (int i = 0; i < fields.length; i++) {
                    headerIndexMap.put(fields[i].trim().toLowerCase(), i); // Normalize headers to lowercase
                }
                isFirstLine = false;

                // Validate required headers
                if (!headerIndexMap.containsKey("name") ||
                        !headerIndexMap.containsKey("description") ||
                        !headerIndexMap.containsKey("imageurl") ||
                        !headerIndexMap.containsKey("price") ||
                        !headerIndexMap.containsKey("stock") ||
                        !headerIndexMap.containsKey("author") ||
                        !headerIndexMap.containsKey("publisher") ||
                        !headerIndexMap.containsKey("category")) {
                    result.addError(rowNumber, "Missing one or more required columns in the header.");
                    return;
                }

                continue;
            }

            // Access fields by normalized header name
            String name = getCSVValue(fields, headerIndexMap, "name");
            String description = getCSVValue(fields, headerIndexMap, "description");
            String imageUrl = getCSVValue(fields, headerIndexMap, "imageurl");
            String priceStr = getCSVValue(fields, headerIndexMap, "price");
            String stockStr = getCSVValue(fields, headerIndexMap, "stock");
            String author = getCSVValue(fields, headerIndexMap, "author");
            String publisher = getCSVValue(fields, headerIndexMap, "publisher");
            String category = getCSVValue(fields, headerIndexMap, "category");

            // Check for empty required fields
            if (name.isEmpty() || description.isEmpty() || imageUrl.isEmpty() ||
                    priceStr.isEmpty() || stockStr.isEmpty() || author.isEmpty() ||
                    publisher.isEmpty() || category.isEmpty()) {
                result.addError(rowNumber, "Required fields missing.");
                continue;
            }

            try {
                double price = Double.parseDouble(priceStr);
                if (price <= 0) {
                    result.addError(rowNumber, "Price should be a positive number.");
                }
            } catch (NumberFormatException e) {
                result.addError(rowNumber, "Invalid price format.");
            }

            try {
                int stock = Integer.parseInt(stockStr);
                if (stock < 0) {
                    result.addError(rowNumber, "Stock should be a non-negative integer.");
                }
            } catch (NumberFormatException e) {
                result.addError(rowNumber, "Invalid stock format.");
            }

            if (!validCategories.contains(category)) {
                result.addError(rowNumber, "Invalid category.");
            }
        }
    }

    // Helper method to safely fetch a CSV column value by header key
    private String getCSVValue(String[] fields, Map<String, Integer> headerIndexMap, String key) {
        Integer index = headerIndexMap.get(key);
        return (index != null && index < fields.length) ? fields[index].trim() : "";
    }



    // Helper method to check if the category is valid
    private boolean isValidCategory(String category) {
        // Assuming a list or enum of valid categories exists
        List<String> validCategories = Arrays.asList("Fiction", "Non-fiction", "Science", "History", "Technology");
        return validCategories.contains(category);
    }


    private void validateExcel(InputStream is, FileValidationResult result) throws IOException {
        Workbook workbook = new XSSFWorkbook(is);
        Sheet sheet = workbook.getSheetAt(0);

        // Read the header row (assumed to be the first row)
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> headerIndexMap = getHeaderIndexMap(headerRow);

        // Normalize headers to lowercase for case-insensitive comparison
        Map<String, Integer> normalizedHeaderIndexMap = new HashMap<>();
        for (Map.Entry<String, Integer> entry : headerIndexMap.entrySet()) {
            normalizedHeaderIndexMap.put(entry.getKey().toLowerCase(), entry.getValue());
        }

        // Validate headers presence (case-insensitive comparison)
        if (!normalizedHeaderIndexMap.containsKey("name") ||
                !normalizedHeaderIndexMap.containsKey("description") ||
                !normalizedHeaderIndexMap.containsKey("imageurl") ||
                !normalizedHeaderIndexMap.containsKey("price") ||
                !normalizedHeaderIndexMap.containsKey("stock") ||
                !normalizedHeaderIndexMap.containsKey("author") ||
                !normalizedHeaderIndexMap.containsKey("publisher") ||
                !normalizedHeaderIndexMap.containsKey("category")) {
            result.addError(new RowError(1, "Missing one or more required columns in the header."));
            workbook.close();
            return;
        }

        // Iterate over the remaining rows and validate their content
        for (Row row : sheet) {
            int rowNum = row.getRowNum() + 1;
            if (row.getRowNum() == 0) continue; // Skip header row

            try {
                // Dynamically access the columns based on the normalized header index map (case-insensitive)
                String name = getCellValue(row, normalizedHeaderIndexMap, "name");
                String description = getCellValue(row, normalizedHeaderIndexMap, "description");
                String imageUrl = getCellValue(row, normalizedHeaderIndexMap, "imageurl");
                double price = getNumericCellValue(row, normalizedHeaderIndexMap, "price");
                int stock = (int) getNumericCellValue(row, normalizedHeaderIndexMap, "stock");
                String author = getCellValue(row, normalizedHeaderIndexMap, "author");
                String publisher = getCellValue(row, normalizedHeaderIndexMap, "publisher");
                String category = getCellValue(row, normalizedHeaderIndexMap, "category");

                // Check for missing or invalid values
                if (name.isEmpty() || description.isEmpty() || imageUrl.isEmpty() ||
                        price <= 0 || stock < 0 || author.isEmpty() || publisher.isEmpty() || category.isEmpty()) {
                    result.addError(new RowError(rowNum, "One or more required fields are missing or invalid."));
                }

                // Validate price and stock
                if (price <= 0) {
                    result.addError(new RowError(rowNum, "Invalid price value (should be a positive number)."));
                }
                if (stock < 0) {
                    result.addError(new RowError(rowNum, "Invalid stock value (should be a positive integer)."));
                }

                // Validate category
                if (!isValidCategory(category)) {
                    result.addError(new RowError(rowNum, "Invalid category."));
                }

            } catch (Exception e) {
                result.addError(new RowError(rowNum, "Invalid or missing fields."));
            }
        }

        workbook.close();
    }


    // Helper method to map header column names to their indexes
    private Map<String, Integer> getHeaderIndexMap(Row headerRow) {
        Map<String, Integer> headerIndexMap = new HashMap<>();
        for (Cell cell : headerRow) {
            String header = cell.getStringCellValue().trim();
            headerIndexMap.put(header, cell.getColumnIndex());
        }
        return headerIndexMap;
    }

    // Helper method to get a cell value (String) from the row based on the column header
    private String getCellValue(Row row, Map<String, Integer> headerIndexMap, String columnName) {
        Integer columnIndex = headerIndexMap.get(columnName);
        if (columnIndex != null) {
            Cell cell = row.getCell(columnIndex);
            if (cell != null) {
                return cell.getStringCellValue().trim();
            }
        }
        return "";
    }

    // Helper method to get a numeric cell value from the row based on the column header
    private double getNumericCellValue(Row row, Map<String, Integer> headerIndexMap, String columnName) {
        Integer columnIndex = headerIndexMap.get(columnName);
        if (columnIndex != null) {
            Cell cell = row.getCell(columnIndex);
            if (cell != null && cell.getCellType() == CellType.NUMERIC) {
                return cell.getNumericCellValue();
            }
        }
        return 0;
    }

    public void importBooksFromFile(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();

        assert filename != null;
        if (filename.endsWith(".csv")) {
            parseCSV(file.getInputStream());
        } else if (filename.endsWith(".xlsx")) {
            parseExcel(file.getInputStream());
        } else {
            throw new IllegalArgumentException("Unsupported file format");
        }
    }

    public FileValidationResult validateBooksFile(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        FileValidationResult result = new FileValidationResult();

        if (filename == null) {
            result.addError(0, "Filename is null.");
            return result;
        }

        if (filename.endsWith(".csv")) {
            validateCSV(file.getInputStream(), result);
        } else if (filename.endsWith(".xlsx")) {
            validateExcel(file.getInputStream(), result);
        } else {
            result.addError(0, "Unsupported file format: must be .csv or .xlsx");
        }

        return result;
    }

    //methods for stock management
    @Transactional
    public Product updateProduct(Long id, ProductUpdateDTO dto,MultipartFile imageFile) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        boolean wasOutOfStock = existing.getStock() <= 0;

        if (dto.getName() != null) existing.setName(dto.getName());
        if (dto.getDescription() != null) existing.setDescription(dto.getDescription());
        if (dto.getPrice() != null) existing.setPrice(dto.getPrice());
        
        if(wasOutOfStock && dto.getStock() != null && dto.getStock() > 0){
            //call the notifying wishlist service
            notifyWishlistUsersIfSubscribed(existing);
        }
        
        
        if (dto.getStock() != null) existing.setStock(dto.getStock());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            existing.setCategory(category);
        }
        if (dto.getAuthor() != null) existing.setAuthor(dto.getAuthor());
        if (dto.getPublisher() != null) existing.setPublisher(dto.getPublisher());
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(imageFile);
            existing.setImageUrl(imageUrl);
        }


        return productRepository.save(existing);
    }


    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }


    public Page<Product> searchByName(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable);
    }

    public Page<Product> filterByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findAllByCategoryId(categoryId, pageable);
    }

    public Page<Product> filterByStockLevel(int maxStock, Pageable pageable) {
        return productRepository.findByStockLessThanEqual(maxStock, pageable);
    }

    public Product addProduct(ProductUpdateDTO dto, MultipartFile imageFile ) throws IOException {

        String imageUrl = cloudinaryService.uploadImage(imageFile);

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());

        product.setPrice(dto.getPrice());
        product.setStock(dto.getStock());
        product.setAuthor(dto.getAuthor());
        product.setPublisher(dto.getPublisher());
        product.setImageUrl(imageUrl);

        // Assuming you have a CategoryService or repo
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid category ID"));
        product.setCategory(category);

        return productRepository.save(product);
    }

    @Transactional
    public void assignDummyBarcodes() {
        List<Product> products = productRepository.findAll();
        int counter = 1000000000; // Start with a 10-digit number (simulate EAN-13 or ISBN)

        for (Product product : products) {
            if (product.getBarcode() == null || product.getBarcode().isBlank()) {
                product.setBarcode("978" + counter); // ISBN-like dummy barcode
                counter++;
            }
        }

        productRepository.saveAll(products);
    }

    private void notifyWishlistUsersIfSubscribed(Product product) {
        List<Wishlist> wishlistItems = wishlistRepository.findByProduct(product);
        for (Wishlist item : wishlistItems) {
            User user = item.getUser();
            if (user.isSubscribedToEmails()) {
                emailService.sendBackInStockEmail(user.getEmail(), product.getName());
            }
        }
    }


}


