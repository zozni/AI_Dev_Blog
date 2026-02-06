import requests
import json
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from pathlib import Path
import sys

def fetch_tags_from_api(api_url="http://localhost:8080/api/tags/cloud"):
    """백엔드 API에서 태그 데이터 가져오기"""
    try:
        response = requests.get(api_url, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"API 호출 실패: {e}")    
        sys.exit(1)

def generate_word_cloud(tags_data, output_path="output/tag_cloud.png"):
    """태그 데이터로 워드클라우드 생성"""          
    
    # 태그 이름과 게시글 수를 딕셔너리로 변환
    word_freq = {tag['name']: tag['postCount'] for tag in tags_data}
    
    if not word_freq:
        print("태그 데이터가 없습니다.")
        # 빈 이미지 생성
        plt.figure(figsize=(12, 6))
        plt.text(0.5, 0.5, 'No Tags Available', 
                ha='center', va='center', fontsize=30, color='gray')
        plt.axis('off')
        output_dir = Path(output_path).parent
        output_dir.mkdir(exist_ok=True)
        plt.savefig(output_path, dpi=150, bbox_inches='tight', 
                   facecolor='white', edgecolor='none')
        plt.close()
        return
    
    # 워드클라우드 생성
    wordcloud = WordCloud(
        width=1200,
        height=600,
        background_color='white',
        colormap='viridis',
        relative_scaling=0.5,
        min_font_size=10,
        max_font_size=100,
        prefer_horizontal=0.7,
        margin=10
    ).generate_from_frequencies(word_freq)
    
    # 이미지 저장
    output_dir = Path(output_path).parent
    output_dir.mkdir(exist_ok=True)
    
    plt.figure(figsize=(12, 6))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.tight_layout(pad=0)
    plt.savefig(output_path, dpi=150, bbox_inches='tight', facecolor='white', edgecolor='none')
    plt.close()
    
    print(f"워드클라우드 생성 완료: {output_path}")

if __name__ == "__main__":
    # API에서 태그 데이터 가져오기
    tags = fetch_tags_from_api()
    
    # 워드클라우드 생성
    generate_word_cloud(tags)