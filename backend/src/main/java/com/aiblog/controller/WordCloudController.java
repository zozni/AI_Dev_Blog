package com.aiblog.controller;

import com.aiblog.service.WordCloudService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/wordcloud")
@RequiredArgsConstructor
public class WordCloudController {
    
    private final WordCloudService wordCloudService;
    
    /**
     * 워드클라우드 이미지 조회
     */
    @GetMapping("/image")
    public ResponseEntity<byte[]> getWordCloudImage() {
        try {
            byte[] imageBytes = wordCloudService.getWordCloudImage();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setCacheControl("no-cache");
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (IOException e) {
            log.error("워드클라우드 이미지 조회 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * 워드클라우드 수동 재생성
     */
    @PostMapping("/generate")
    public ResponseEntity<String> generateWordCloud() {
        try {
            wordCloudService.generateWordCloud();
            return ResponseEntity.ok("워드클라우드 생성 완료");
        } catch (Exception e) {
            log.error("워드클라우드 생성 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("워드클라우드 생성 실패: " + e.getMessage());
        }
    }
}