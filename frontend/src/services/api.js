import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postApi = {
  getAllPosts: (page = 0, size = 10, keyword = '', categoryId = null, tag = null) => {
    let url = `/posts?page=${page}&size=${size}`;
    if (keyword) url += `&keyword=${keyword}`;
    if (categoryId) url += `&categoryId=${categoryId}`;
    if (tag) url += `&tag=${tag}`;
    return api.get(url);
  },
  getPost: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
};

export const categoryApi = {
  getAllCategories: () => api.get('/categories'),
  createCategory: (name, description) => 
    api.post('/categories', null, { params: { name, description } }),
};

export const tagApi = {
  getAllTags: () => api.get('/tags'),
};

// 댓글 API
export const commentApi = {
  getComments: (postId) => api.get(`/posts/${postId}/comments`),
  createComment: (postId, commentData) => api.post(`/posts/${postId}/comments`, commentData),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

// 좋아요 API
export const likeApi = {
  getLikeInfo: (postId) => api.get(`/posts/${postId}/likes`),
  toggleLike: (postId) => api.post(`/posts/${postId}/likes`),
};

// ✅ 이미지 API 추가
export const imageApi = {
  // 이미지 업로드
  uploadImage: (postId, file, displayOrder = 0) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('displayOrder', displayOrder);
    
    return axios.post(`${API_BASE_URL}/posts/${postId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // 이미지 조회 (URL 반환)
  getImageUrl: (postId, imageId) => {
    return `${API_BASE_URL}/posts/${postId}/images/${imageId}`;
  },
  
  // 게시글의 모든 이미지 정보 조회
  getPostImages: (postId) => api.get(`/posts/${postId}/images`),
  
  // 이미지 삭제
  deleteImage: (postId, imageId) => api.delete(`/posts/${postId}/images/${imageId}`),
};

export default api;