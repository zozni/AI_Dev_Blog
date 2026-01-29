package com.aiblog.config;

import com.aiblog.model.Category;
import com.aiblog.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(CategoryRepository categoryRepository) {
        return args -> {
            // 카테고리가 비어있을 때만 초기 데이터 생성
            if (categoryRepository.count() == 0) {
                categoryRepository.save(Category.builder()
                        .name("Terminology")
                        .description("AI 관련 용어 설명")
                        .build());
                
                categoryRepository.save(Category.builder()
                        .name("Paper")
                        .description("논문 리뷰 및 요약")
                        .build());
                
                categoryRepository.save(Category.builder()
                        .name("Troubleshooting")
                        .description("오류 해결 방법")
                        .build());
                
                categoryRepository.save(Category.builder()
                        .name("General")
                        .description("기타 주제")
                        .build());
                
                System.out.println("✅ 초기 카테고리 데이터 생성 완료");
            }
        };
    }
}