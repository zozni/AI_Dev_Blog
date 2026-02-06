import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // useSearchParams 추가
import { postApi, categoryApi, tagApi } from '../services/api';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Pets from '../components/Pets';
import TagCloud from '../components/TagCloud'; // TagCloud 추가
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // URL 파라미터 읽기
  const [searchParams] = useSearchParams();

  // 타이핑 애니메이션
  const [displayTitle, setDisplayTitle] = useState('');
  const fullTitle = 'AI Dev Blog';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullTitle.length) {
        setDisplayTitle(fullTitle.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // URL 파라미터에서 태그 읽기
  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
      setKeyword('');
      setSelectedCategory(null);
    }
  }, [searchParams]);

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [currentPage, keyword, selectedCategory, selectedTag]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 로딩 실패:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await tagApi.getAllTags();
      setTags(response.data);
    } catch (error) {
      console.error('태그 로딩 실패:', error);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await postApi.getAllPosts(
        currentPage,
        pageSize,
        keyword,
        selectedCategory,
        selectedTag
      );
      setPosts(response.data.content);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
      setLoading(false);
    }
  };

  const handleSearch = (searchKeyword) => {
    setKeyword(searchKeyword);
    setSelectedCategory(null);
    setSelectedTag(null);
    setCurrentPage(0);
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setKeyword('');
    setSelectedTag(null);
    setCurrentPage(0);
  };

  const handleTagFilter = (tagName) => {
    setSelectedTag(tagName === selectedTag ? null : tagName);
    setKeyword('');
    setSelectedCategory(null);
    setCurrentPage(0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '.').replace('.', '');
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'AI': '#a855f7',
      'Backend': '#00d9ff',
      'Frontend': '#00ff88',
    };
    return colors[categoryName] || '#f97316';
  };

  const getFilterTitle = () => {
    if (keyword) return `검색: "${keyword}"`;
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      return `${category?.name}`;
    }
    if (selectedTag) return `#${selectedTag}`;
    return 'All Posts';
  };

  if (loading && posts.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="blog-container">
      {/* Header */}
      <header className="blog-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <span className="terminal-symbol">&gt;_</span>
            </div>
            <span className="logo-text">AI Dev Blog</span>
          </div>
          <Link to="/create" className="create-btn">
            <span>+ New Post</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-label">
            <span className="code-symbol">$</span>
            <span>cat welcome.md</span>
          </div>
          <h1 className="hero-title">
            {displayTitle}
            <span className="cursor-blink">|</span>
          </h1>
          <p className="hero-description">
            AI 개발과 자동화에 관한 인사이트를 공유합니다.
            <span className="highlight"> Spring Boot + React로 구축된 풀스택 블로그</span>
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-layout">
          {/* Posts Area */}
          <div className="posts-area">
            {/* Category Filter */}
            <div className="category-filter">
              <button
                onClick={() => handleCategoryFilter(null)}
                className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Filter Title */}
            <div className="filter-header">
              <h2>{getFilterTitle()}</h2>
              <span className="post-count">{posts.length} posts</span>
            </div>

            {/* Posts Grid */}
            {posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <p>게시글이 없습니다</p>
              </div>
            ) : (
              <div className="posts-grid">
                {posts.map((post) => (
                  <Link to={`/post/${post.id}`} key={post.id} className="post-card">
                    <div className="card-header">
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
                    </div>
                    
                    <h3 className="post-title">{post.title}</h3>
                    
                    <p className="post-excerpt">
                      {post.content.replace(/[#*`]/g, '').substring(0, 120)}...
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="post-tags">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag.id} className="tag">#{tag.name}</span>
                        ))}
                      </div>
                    )}
                    
                    <div className="post-footer">
                      <div className="post-meta">
                        <span className="author">👤 {post.author}</span>
                        <span className="date">📅 {formatDate(post.createdAt)}</span>
                      </div>
                      <span className="views">👁️ {post.viewCount}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Sidebar */}
          <aside className="sidebar">
            {/* 태그 클라우드 추가 */}
            <TagCloud />

            {/* Tags */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <span className="icon">🏷️</span>
                Trending Tags
              </h3>
              <div className="tags-cloud">
                {tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagFilter(tag.name)}
                    className={`tag-btn ${selectedTag === tag.name ? 'active' : ''}`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">
                <span className="icon">⚡</span>
                Blog Stats
              </h3>
              <div className="stats-list">
                <div className="stat-item">
                  <span className="stat-label">Total Posts</span>
                  <span className="stat-value">{posts.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Categories</span>
                  <span className="stat-value">{categories.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Tags</span>
                  <span className="stat-value">{tags.length}</span>
                </div>
              </div>
            </div>
            <Pets />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PostList;