package com.aiblog.controller;

import com.aiblog.dto.PageResponse;
import com.aiblog.dto.PostRequest;
import com.aiblog.dto.PostResponse;
import com.aiblog.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    
    private final PostService postService;
    
    @GetMapping
    public ResponseEntity<PageResponse<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String tag
    ) {
        Page<PostResponse> posts;
        
        if (keyword != null && !keyword.isEmpty()) {
            posts = postService.searchPosts(keyword, page, size);
        } else if (categoryId != null) {
            posts = postService.getPostsByCategory(categoryId, page, size);
        } else if (tag != null && !tag.isEmpty()) {
            posts = postService.getPostsByTag(tag, page, size);
        } else {
            posts = postService.getAllPosts(page, size);
        }
        
        return ResponseEntity.ok(PageResponse.from(posts));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPost(id));
    }
    
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(postService.createPost(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}