import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi } from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await postApi.getPost(id);
      setPost(response.data);
      setLoading(false);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await postApi.deletePost(id);
        navigate('/');
      } catch (error) {
        console.error('삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'AI': '#a855f7',
      'Backend': '#00d9ff',
      'Frontend': '#00ff88',
    };
    return colors[categoryName] || '#f97316';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>게시글을 찾을 수 없습니다.</p>
        <Link to="/" className="back-home-btn">홈으로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      {/* Header */}
      <header className="detail-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Back to posts</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="detail-main">
        <article className="post-article">
          {/* Post Header */}
          <header className="post-header">
            {post.category && (
              <span 
                className="category-badge"
                style={{ 
                  color: getCategoryColor(post.category.name),
                  backgroundColor: `${getCategoryColor(post.category.name)}15`
                }}
              >
                {post.category.name}
              </span>
            )}
            
            <h1 className="article-title">{post.title}</h1>
            
            <div className="article-meta">
              <div className="meta-left">
                <span className="author">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {post.author}
                </span>
                <span className="date">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <span className="views">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {post.viewCount} views
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="article-tags">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="tag">#{tag.name}</span>
                ))}
              </div>
            )}
          </header>

          {/* Post Content */}
          <div className="article-content">
            <MarkdownViewer content={post.content} />
          </div>

          {/* Post Actions */}
          <footer className="article-footer">
            <div className="action-buttons">
              <Link to={`/edit/${post.id}`} className="edit-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </Link>
              <button onClick={handleDelete} className="delete-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
}

export default PostDetail;