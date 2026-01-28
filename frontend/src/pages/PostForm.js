import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi, categoryApi } from '../services/api';
import MarkdownViewer from '../components/MarkdownViewer';
import './PostForm.css';

function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    categoryId: '',
    tags: [],
  });

  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEditMode) {
      loadPost();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('카테고리 로딩 실패:', error);
    }
  };

  const loadPost = async () => {
    try {
      const response = await postApi.getPost(id);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        author: response.data.author,
        categoryId: response.data.category?.id || '',
        tags: response.data.tags ? response.data.tags.map(t => t.name) : [],
      });
    } catch (error) {
      console.error('게시글 로딩 실패:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력하세요';
    }
    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력하세요';
    }
    if (!formData.author.trim()) {
      newErrors.author = '작성자를 입력하세요';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const submitData = {
        ...formData,
        categoryId: formData.categoryId || null,
        tags: formData.tags.length > 0 ? formData.tags : null,
      };

      if (isEditMode) {
        await postApi.updatePost(id, submitData);
      } else {
        await postApi.createPost(submitData);
      }
      navigate('/');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let newText = formData.content;
    let cursorPos = start;

    switch(syntax) {
      case 'bold':
        newText = formData.content.substring(0, start) + `**${selectedText || '굵은 텍스트'}**` + formData.content.substring(end);
        cursorPos = start + 2;
        break;
      case 'italic':
        newText = formData.content.substring(0, start) + `*${selectedText || '기울임 텍스트'}*` + formData.content.substring(end);
        cursorPos = start + 1;
        break;
      case 'heading':
        newText = formData.content.substring(0, start) + `## ${selectedText || '제목'}` + formData.content.substring(end);
        cursorPos = start + 3;
        break;
      case 'code':
        newText = formData.content.substring(0, start) + `\`${selectedText || '코드'}\`` + formData.content.substring(end);
        cursorPos = start + 1;
        break;
      case 'codeblock':
        newText = formData.content.substring(0, start) + `\n\`\`\`javascript\n${selectedText || '코드 블록'}\n\`\`\`\n` + formData.content.substring(end);
        cursorPos = start + 14;
        break;
      case 'link':
        newText = formData.content.substring(0, start) + `[${selectedText || '링크 텍스트'}](url)` + formData.content.substring(end);
        cursorPos = start + 1;
        break;
      case 'list':
        newText = formData.content.substring(0, start) + `- ${selectedText || '리스트 항목'}` + formData.content.substring(end);
        cursorPos = start + 2;
        break;
      default:
        break;
    }

    setFormData({ ...formData, content: newText });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  return (
    <div className="post-form-container">
      <Link to="/" className="back-button">취소</Link>
      
      <div className="form-wrapper">
        <h1>{isEditMode ? '✏️ 게시글 수정' : '✨ 새 게시글 작성'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="author">작성자</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="작성자를 입력하세요"
                className={errors.author ? 'error' : ''}
              />
              {errors.author && <span className="error-message">{errors.author}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">카테고리</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">카테고리 선택 (선택사항)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">태그</label>
            <input
              type="text"
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그 입력 후 Enter (선택사항)"
            />
            <div className="tag-container">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag-chip">
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div className="editor-header">
              <label htmlFor="content">내용 (마크다운 지원)</label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="preview-toggle"
              >
                {showPreview ? '📝 편집' : '👁️ 미리보기'}
              </button>
            </div>

            <div className="markdown-toolbar">
              <button type="button" onClick={() => insertMarkdown('bold')} title="굵게">
                <strong>B</strong>
              </button>
              <button type="button" onClick={() => insertMarkdown('italic')} title="기울임">
                <em>I</em>
              </button>
              <button type="button" onClick={() => insertMarkdown('heading')} title="제목">
                H
              </button>
              <button type="button" onClick={() => insertMarkdown('code')} title="인라인 코드">
                {'</>'}
              </button>
              <button type="button" onClick={() => insertMarkdown('codeblock')} title="코드 블록">
                {'{ }'}
              </button>
              <button type="button" onClick={() => insertMarkdown('link')} title="링크">
                🔗
              </button>
              <button type="button" onClick={() => insertMarkdown('list')} title="리스트">
                ≡
              </button>
            </div>

            {showPreview ? (
              <div className="preview-container">
                <MarkdownViewer content={formData.content || '*미리보기 내용이 없습니다*'} />
              </div>
            ) : (
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="마크다운 문법을 사용하여 내용을 입력하세요&#10;&#10;예시:&#10;# 제목&#10;## 부제목&#10;**굵은 글씨**&#10;*기울임*&#10;- 리스트&#10;```javascript&#10;코드 블록&#10;```"
                rows="20"
                className={errors.content ? 'error' : ''}
              />
            )}
            {errors.content && <span className="error-message">{errors.content}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              {isEditMode ? '✅ 수정하기' : '✨ 작성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;