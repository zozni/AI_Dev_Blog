package com.aiblog.service;

import com.aiblog.model.Post;
import com.aiblog.model.PostImage;
import com.aiblog.repository.PostImageRepository;
import com.aiblog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostImageService {
    
    private final PostImageRepository postImageRepository;
    private final PostRepository postRepository;
    
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final long MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB
    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
    
    @Transactional
    public PostImage uploadImage(Long postId, MultipartFile file, Integer displayOrder) {
        // 게시글 존재 확인
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 파일 검증
        validateFile(file);
        
        // 전체 이미지 크기 확인
        long currentTotalSize = postImageRepository.findByPostIdOrderByDisplayOrderAsc(postId)
                .stream()
                .mapToLong(PostImage::getFileSize)
                .sum();
        
        if (currentTotalSize + file.getSize() > MAX_TOTAL_SIZE) {
            throw new RuntimeException("게시물당 총 이미지 크기는 20MB를 초과할 수 없습니다.");
        }
        
        try {
            PostImage image = PostImage.builder()
                    .post(post)
                    .originalFileName(file.getOriginalFilename())
                    .imageData(file.getBytes())
                    .contentType(file.getContentType())
                    .fileSize(file.getSize())
                    .displayOrder(displayOrder != null ? displayOrder : 0)
                    .build();
            
            return postImageRepository.save(image);
        } catch (IOException e) {
            throw new RuntimeException("이미지 업로드 실패: " + e.getMessage());
        }
    }
    
    public PostImage getImage(Long imageId) {
        return postImageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("이미지를 찾을 수 없습니다."));
    }
    
    public List<PostImage> getPostImages(Long postId) {
        return postImageRepository.findByPostIdOrderByDisplayOrderAsc(postId);
    }
    
    @Transactional
    public void deleteImage(Long imageId) {
        postImageRepository.deleteById(imageId);
    }
    
    @Transactional
    public void deletePostImages(Long postId) {
        postImageRepository.deleteByPostId(postId);
    }
    
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("파일이 비어있습니다.");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("파일 크기는 5MB를 초과할 수 없습니다.");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            throw new RuntimeException("지원하지 않는 파일 형식입니다. (jpg, png, gif, webp만 가능)");
        }
    }
}