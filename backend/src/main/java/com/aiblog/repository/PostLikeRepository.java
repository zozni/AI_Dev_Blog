package com.aiblog.repository;

import com.aiblog.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    int countByPostId(Long postId);
    Optional<PostLike> findByPostIdAndUserIdentifier(Long postId, String userIdentifier);
    boolean existsByPostIdAndUserIdentifier(Long postId, String userIdentifier);
    void deleteByPostIdAndUserIdentifier(Long postId, String userIdentifier);
}