package com.aiblog.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
public class WordCloudService {
    
    @Value("${wordcloud.python.path:python3}")
    private String pythonPath;
    
    @Value("${wordcloud.script.path:../ai/word_cloud_generator.py}")
    private String scriptPath;
    
    @Value("${wordcloud.output.path:../ai/output/tag_cloud.png}")
    private String outputPath;
    
    /**
     * Python 스크립트 실행하여 워드클라우드 생성
     */
    public void generateWordCloud() {
        try {
            log.info("워드클라우드 생성 시작");
            
            ProcessBuilder processBuilder = new ProcessBuilder(
                pythonPath, 
                scriptPath
            );
            
            // 작업 디렉토리를 ai 폴더로 설정
            File aiDirectory = new File("../ai");
            if (aiDirectory.exists()) {
                processBuilder.directory(aiDirectory);
            }
            
            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();
            
            // 프로세스 출력 로깅
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    log.info("Python: {}", line);
                }
            }
            
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                log.info("워드클라우드 생성 완료");
            } else {
                log.error("워드클라우드 생성 실패. Exit code: {}", exitCode);
            }
            
        } catch (IOException | InterruptedException e) {
            log.error("워드클라우드 생성 중 오류 발생", e);
            Thread.currentThread().interrupt();
        }
    }
    
    /**
     * 생성된 워드클라우드 이미지 파일 반환
     */
    public byte[] getWordCloudImage() throws IOException {
        Path imagePath = Paths.get(outputPath);
        
        if (!Files.exists(imagePath)) {
            log.warn("워드클라우드 이미지가 없습니다. 생성을 시도합니다.");
            generateWordCloud();
            
            // 생성 후에도 없으면 예외
            if (!Files.exists(imagePath)) {
                throw new IOException("워드클라우드 이미지 생성 실패");
            }
        }
        
        return Files.readAllBytes(imagePath);
    }
}