package com.aiblog.service;

import com.aiblog.model.Post;
import com.aiblog.model.PostLike;
import com.aiblog.repository.PostLikeRepository;
import com.aiblog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostLikeService {
    
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    
    public int getLikeCount(Long postId) {
        return postLikeRepository.countByPostId(postId);
    }
    
    public boolean isLiked(Long postId, String userIdentifier) {
        return postLikeRepository.existsByPostIdAndUserIdentifier(postId, userIdentifier);
    }
    
    @Transactional
    public void toggleLike(Long postId, String userIdentifier) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        if (postLikeRepository.existsByPostIdAndUserIdentifier(postId, userIdentifier)) {
            postLikeRepository.deleteByPostIdAndUserIdentifier(postId, userIdentifier);
        } else {
            PostLike postLike = PostLike.builder()
                    .post(post)
                    .userIdentifier(userIdentifier)
                    .build();
            postLikeRepository.save(postLike);
        }
    }
}