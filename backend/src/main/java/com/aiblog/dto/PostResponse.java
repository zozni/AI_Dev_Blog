package com.aiblog.dto;

import com.aiblog.model.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostResponse {
    
    private Long id;
    private String title;
    private String content;
    private String author;
    private CategoryResponse category;
    private Set<TagResponse> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer viewCount;
    private Integer likeCount;
    private Boolean isLiked;
    private List<CommentResponse> comments;
    
    // ✅ 새로 추가: 이미지 ID 리스트
    private List<Long> imageIds;
    
    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .author(post.getAuthor())
                .category(post.getCategory() != null ? CategoryResponse.from(post.getCategory()) : null)
                .tags(post.getTags().stream()
                        .map(TagResponse::from)
                        .collect(Collectors.toSet()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .viewCount(post.getViewCount())
                .likeCount(post.getLikes() != null ? post.getLikes().size() : 0)
                .isLiked(false)
                .comments(post.getComments() != null ? 
                        post.getComments().stream()
                                .map(CommentResponse::from)
                                .collect(Collectors.toList()) : 
                        List.of())
                // ✅ 새로 추가: 이미지 ID 매핑
                .imageIds(post.getImages() != null ?
                        post.getImages().stream()
                                .map(img -> img.getId())
                                .collect(Collectors.toList()) :
                        List.of())
                .build();
    }
}