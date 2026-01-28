package com.aiblog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class PostRequest {
    
    @NotBlank(message = "제목은 필수입니다")
    @Size(max = 200, message = "제목은 200자를 초과할 수 없습니다")
    private String title;
    
    @NotBlank(message = "내용은 필수입니다")
    private String content;
    
    @Size(max = 100, message = "작성자는 100자를 초과할 수 없습니다")
    private String author;
    
    private Long categoryId;
    
    private Set<String> tags;
}