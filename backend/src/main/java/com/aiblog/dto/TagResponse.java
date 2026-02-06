package com.aiblog.dto;

import com.aiblog.model.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TagResponse {
    private Long id;
    private String name;
    private Long postCount; // 게시글 개수 추가
    
    public static TagResponse from(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .build();
    }
    
    // postCount 포함 생성자
    public static TagResponse fromWithCount(Tag tag, Long postCount) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .postCount(postCount)
                .build();
    }
}