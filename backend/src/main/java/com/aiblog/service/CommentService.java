package com.aiblog.service;

import com.aiblog.dto.CommentRequest;
import com.aiblog.dto.CommentResponse;
import com.aiblog.model.Comment;
import com.aiblog.model.Post;
import com.aiblog.repository.CommentRepository;
import com.aiblog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public CommentResponse createComment(Long postId, CommentRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        Comment comment = Comment.builder()
                .post(post)
                .author(request.getAuthor())
                .content(request.getContent())
                .build();
        
        Comment savedComment = commentRepository.save(comment);
        return CommentResponse.from(savedComment);
    }
    
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}