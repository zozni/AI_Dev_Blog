package com.aiblog.service;

import com.aiblog.dto.TagResponse;
import com.aiblog.model.Tag;
import com.aiblog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {
    
    private final TagRepository tagRepository;
    
    public List<TagResponse> getAllTags() {
        return tagRepository.findAll()
                .stream()
                .map(TagResponse::from)
                .collect(Collectors.toList());
    }
    
    // 태그 클라우드용: 게시글 개수 포함
    public List<TagResponse> getTagsWithPostCount() {
        return tagRepository.findAllWithPostCount()
                .stream()
                .map(result -> {
                    Tag tag = (Tag) result[0];
                    Long count = (Long) result[1];
                    return TagResponse.fromWithCount(tag, count);
                })
                .collect(Collectors.toList());
    }
}