package com.example.demo.service;

import com.example.demo.entity.BookItem;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OCRService {

    private String extractTessdataToTemp() throws IOException {
        Path tempDir = Files.createTempDirectory("tessdata");

        for (String lang : new String[]{"eng", "sin"}) {
            String resourceName = "/tessdata/" + lang + ".traineddata";
            try (InputStream in = getClass().getResourceAsStream(resourceName)) {
                if (in == null) throw new FileNotFoundException(resourceName);
                Files.copy(in, tempDir.resolve(lang + ".traineddata"), StandardCopyOption.REPLACE_EXISTING);
            }
        }

        return tempDir.toAbsolutePath().toString();
    }


    public String extractText(MultipartFile image) {
        ITesseract tesseract = new Tesseract();
        try {
//            String tessDataPath = Paths.get(System.getProperty("user.dir"), "/tessdata").normalize().toAbsolutePath().toString();
            String tessDataPath = extractTessdataToTemp();
            tesseract.setDatapath(tessDataPath);
            tesseract.setLanguage("eng+sin");
            File tempFile = File.createTempFile("ocr-upload-",image.getOriginalFilename());
            image.transferTo(tempFile);
            String text = tesseract.doOCR(tempFile);
            tempFile.delete();
            return text;
        }catch (IOException | TesseractException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }

    }

    public List<BookItem> parseBookItems(String rawText) {
        List<BookItem> bookItems = new ArrayList<>();
        String[] lines = rawText.split("\n");
        Pattern pattern = Pattern.compile("(.+?)[\\s\\-x\\.\\(]*([0-9]+)[\\)]*\\s*$");
        for (String line : lines) {
            String cleaned = line.trim();
            if (cleaned.isEmpty()) {
                continue;
            }
            Matcher matcher = pattern.matcher(cleaned);
            if (matcher.find()) {
                String title = matcher.group(1).trim();
                int quantity = Integer.parseInt(matcher.group(2).trim());
                bookItems.add(new BookItem(title, quantity));
            } else {
                bookItems.add(new BookItem(cleaned, 1));
            }
        }
        return bookItems;
    }
}
