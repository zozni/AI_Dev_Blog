import React, { useState, useEffect } from 'react';
import { wordCloudApi } from '../services/api';
import './TagCloud.css';

function TagCloud() {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadWordCloud();
  }, []);

  const loadWordCloud = () => {
    setLoading(true);
    setError(false);
    // 캐시 방지를 위해 타임스탬프 추가
    setImageUrl(wordCloudApi.getImageUrl());
    
    // 이미지 로드 확인
    const img = new Image();
    img.onload = () => setLoading(false);
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    img.src = wordCloudApi.getImageUrl();
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await wordCloudApi.generate();
      // 재생성 후 약간의 딜레이를 주고 이미지 리로드
      setTimeout(() => {
        loadWordCloud();
      }, 1500);
    } catch (error) {
      console.error('워드클라우드 재생성 실패:', error);
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tag-cloud-widget">
        <h3 className="widget-title">☁️ 태그 클라우드</h3>
        <div className="tag-cloud-loading">
          <div className="loading-spinner"></div>
          <p>워드클라우드 생성 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tag-cloud-widget">
        <h3 className="widget-title">☁️ 태그 클라우드</h3>
        <div className="tag-cloud-error">
          <p>워드클라우드를 불러올 수 없습니다.</p>
          <button onClick={handleRefresh} className="refresh-button">
            🔄 다시 생성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tag-cloud-widget">
      <div className="widget-header">
        <h3 className="widget-title">☁️ 태그 클라우드</h3>
        <button 
          onClick={handleRefresh} 
          className="refresh-icon-button"
          title="워드클라우드 새로고침"
        >
          🔄
        </button>
      </div>
      <div className="word-cloud-container">
        <img 
          src={imageUrl} 
          alt="태그 워드클라우드" 
          className="word-cloud-image"
        />
      </div>
    </div>
  );
}

export default TagCloud;