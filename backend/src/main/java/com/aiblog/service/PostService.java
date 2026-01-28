package com.aiblog.service;

import com.aiblog.dto.PostRequest;
import com.aiblog.dto.PostResponse;
import com.aiblog.model.Category;
import com.aiblog.model.Post;
import com.aiblog.model.Tag;
import com.aiblog.repository.CategoryRepository;
import com.aiblog.repository.PostRepository;
import com.aiblog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {
    
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    
    public Page<PostResponse> getAllPosts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(PostResponse::from);
    }
    
    public Page<PostResponse> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.searchPosts(keyword, pageable)
                .map(PostResponse::from);
    }
    
    public Page<PostResponse> getPostsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByCategoryId(categoryId, pageable)
                .map(PostResponse::from);
    }
    
    public Page<PostResponse> getPostsByTag(String tagName, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return postRepository.findByTagName(tagName, pageable)
                .map(PostResponse::from);
    }
    
    @Transactional
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
        return PostResponse.from(post);
    }
    
    @Transactional
    public PostResponse createPost(PostRequest request) {
        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(request.getAuthor())
                .viewCount(0)
                .build();
        
        // 카테고리 설정
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
            post.setCategory(category);
        }
        
        // 태그 설정
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
                tags.add(tag);
            }
            post.setTags(tags);
        }
        
        Post savedPost = postRepository.save(post);
        return PostResponse.from(savedPost);
    }
    
    @Transactional
    public PostResponse updatePost(Long id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthor(request.getAuthor());
        
        // 카테고리 업데이트
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
            post.setCategory(category);
        } else {
            post.setCategory(null);
        }
        
        // 태그 업데이트
        post.getTags().clear();
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = new HashSet<>();
            for (String tagName : request.getTags()) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));
                tags.add(tag);
            }
            post.setTags(tags);
        }
        
        return PostResponse.from(post);
    }
    
    @Transactional
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}