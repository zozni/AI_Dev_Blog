package com.aiblog.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String author;
    private String content;
}