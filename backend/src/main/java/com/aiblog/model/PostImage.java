package com.aiblog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
    
    @Column(nullable = false, length = 500)
    private String originalFileName;
    
    @Lob
    @Column(nullable = false, columnDefinition = "LONGBLOB")  // ✅ 수정
    private byte[] imageData;
    
    @Column(nullable = false, length = 50)
    private String contentType;
    
    @Column(nullable = false)
    private Long fileSize;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
    
    @Column(nullable = false)
    private Integer displayOrder;
}