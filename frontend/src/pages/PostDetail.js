import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi, commentApi, likeApi, imageApi } from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // 댓글 관련 상태
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ author: '', content: '' });
  
  // 좋아요 관련 상태
  const [likeInfo, setLikeInfo] = useState({ likeCount: 0, isLiked: false });

  // ✅ 이미지 관련 상태 추가
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    loadPost();
    loadComments();
    loadLikeInfo();
    loadImages(); // ✅ 이미지 로딩 추가
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

  const loadComments = async () => {
    try {
      const response = await commentApi.getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
    }
  };

  const loadLikeInfo = async () => {
    try {
      const response = await likeApi.getLikeInfo(id);
      setLikeInfo(response.data);
    } catch (error) {
      console.error('좋아요 정보 로딩 실패:', error);
    }
  };

  // ✅ 이미지 로딩 함수
  const loadImages = async () => {
    try {
      const response = await imageApi.getPostImages(id);
      setImages(response.data);
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.author.trim() || !commentForm.content.trim()) {
      alert('작성자와 내용을 모두 입력하세요.');
      return;
    }
    
    try {
      await commentApi.createComment(id, commentForm);
      setCommentForm({ author: '', content: '' });
      loadComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      try {
        await commentApi.deleteComment(id, commentId);
        loadComments();
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  const handleLikeToggle = async () => {
    try {
      const response = await likeApi.toggleLike(id);
      setLikeInfo(response.data);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await postApi.deletePost(id);
      navigate('/');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
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

          {/* ✅ 이미지 갤러리 추가 (본문 위) */}
          {images.length > 0 && (
            <div className="post-images-gallery">
              <div className="images-grid">
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className="gallery-item"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={imageApi.getImageUrl(id, image.id)}
                      alt={image.originalFileName}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="article-content">
            <MarkdownViewer content={post.content} />
          </div>

          {/* Post Actions */}
          <footer className="article-footer">
            <div className="action-buttons">
              {/* 좋아요 버튼을 왼쪽에 배치 */}
              <button 
                className={`like-button ${likeInfo.isLiked ? 'liked' : ''}`}
                onClick={handleLikeToggle}
              >
                <span className="heart-icon">{likeInfo.isLiked ? '❤️' : '🤍'}</span>
                <span className="like-count">{likeInfo.likeCount}</span>
              </button>
              
              {/* 오른쪽 버튼들 */}
              <div className="right-buttons">
                <Link to={`/edit/${post.id}`} className="edit-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Edit
                </Link>
                <button onClick={() => setShowDeleteModal(true)} className="delete-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </footer>
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <h2 className="comments-title">댓글 {comments.length}</h2>
          
          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="작성자"
              value={commentForm.author}
              onChange={(e) => setCommentForm({ ...commentForm, author: e.target.value })}
              className="comment-author-input"
            />
            <textarea
              placeholder="댓글을 입력하세요"
              value={commentForm.content}
              onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
              className="comment-content-input"
              rows="3"
            />
            <button type="submit" className="comment-submit-btn">댓글 작성</button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="comment-content">{comment.content}</p>
                <button 
                  onClick={() => handleCommentDelete(comment.id)}
                  className="comment-delete-btn"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>게시글 삭제</h3>
            <p>정말 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">
                취소
              </button>
              <button onClick={handleDelete} className="confirm-btn">
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 이미지 확대 모달 */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="image-modal-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
            <img
              src={imageApi.getImageUrl(id, selectedImage.id)}
              alt={selectedImage.originalFileName}
            />
            <p className="image-modal-filename">{selectedImage.originalFileName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDetail;