package com.aiblog.controller;

import com.aiblog.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@RequiredArgsConstructor
public class PostLikeController {
    
    private final PostLikeService postLikeService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getLikeInfo(
            @PathVariable Long postId,
            HttpServletRequest request) {
        String userIdentifier = request.getRemoteAddr();
        
        Map<String, Object> response = new HashMap<>();
        response.put("likeCount", postLikeService.getLikeCount(postId));
        response.put("isLiked", postLikeService.isLiked(postId, userIdentifier));
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable Long postId,
            HttpServletRequest request) {
        String userIdentifier = request.getRemoteAddr();
        
        postLikeService.toggleLike(postId, userIdentifier);
        
        Map<String, Object> response = new HashMap<>();
        response.put("likeCount", postLikeService.getLikeCount(postId));
        response.put("isLiked", postLikeService.isLiked(postId, userIdentifier));
        
        return ResponseEntity.ok(response);
    }
}