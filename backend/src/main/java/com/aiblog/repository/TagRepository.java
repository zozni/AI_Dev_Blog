package com.aiblog.repository;

import com.aiblog.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    
    // 태그별 게시글 개수 조회 (게시글이 있는 태그만)
    @Query("SELECT t, COUNT(p) as postCount FROM Tag t " +
           "JOIN t.posts p " +
           "GROUP BY t.id " +
           "ORDER BY postCount DESC")
    List<Object[]> findAllWithPostCount();
}