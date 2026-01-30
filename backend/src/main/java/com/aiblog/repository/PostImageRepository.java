package com.aiblog.repository;

import com.aiblog.model.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findByPostIdOrderByDisplayOrderAsc(Long postId);
    void deleteByPostId(Long postId);
}