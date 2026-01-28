package com.aiblog.controller;

import com.aiblog.dto.CategoryResponse;
import com.aiblog.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {
    
    private final CategoryService categoryService;
    
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    
    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @RequestParam String name,
            @RequestParam(required = false) String description) {
        return ResponseEntity.ok(categoryService.createCategory(name, description));
    }
}