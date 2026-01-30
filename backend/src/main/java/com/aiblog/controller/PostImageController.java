package com.aiblog.controller;

import com.aiblog.model.PostImage;
import com.aiblog.service.PostImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/images")
@RequiredArgsConstructor
public class PostImageController {
    
    private final PostImageService postImageService;
    
    // 이미지 업로드
    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadImage(
            @PathVariable Long postId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "displayOrder", required = false) Integer displayOrder) {
        
        try {
            PostImage image = postImageService.uploadImage(postId, file, displayOrder);
            
            Map<String, Object> response = new HashMap<>();
            response.put("id", image.getId());
            response.put("originalFileName", image.getOriginalFileName());
            response.put("fileSize", image.getFileSize());
            response.put("displayOrder", image.getDisplayOrder());
            response.put("uploadedAt", image.getUploadedAt());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 이미지 조회 (바이너리 데이터 반환)
    @GetMapping("/{imageId}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {
        try {
            PostImage image = postImageService.getImage(imageId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(image.getContentType()));
            headers.setContentLength(image.getFileSize());
            headers.set(HttpHeaders.CONTENT_DISPOSITION, 
                    "inline; filename=\"" + image.getOriginalFileName() + "\"");
            
            return new ResponseEntity<>(image.getImageData(), headers, HttpStatus.OK);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // 게시글의 모든 이미지 ID 목록 조회
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getPostImages(@PathVariable Long postId) {
        List<PostImage> images = postImageService.getPostImages(postId);
        
        List<Map<String, Object>> response = images.stream()
                .map(image -> {
                    Map<String, Object> imgData = new HashMap<>();
                    imgData.put("id", image.getId());
                    imgData.put("originalFileName", image.getOriginalFileName());
                    imgData.put("fileSize", image.getFileSize());
                    imgData.put("displayOrder", image.getDisplayOrder());
                    imgData.put("uploadedAt", image.getUploadedAt());
                    return imgData;
                })
                .toList();
        
        return ResponseEntity.ok(response);
    }
    
    // 이미지 삭제
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Map<String, String>> deleteImage(@PathVariable Long imageId) {
        try {
            postImageService.deleteImage(imageId);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "이미지가 삭제되었습니다.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}