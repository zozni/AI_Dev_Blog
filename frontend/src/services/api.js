import axios from 'axios';

// 환경에 따라 자동으로 백엔드 주소 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 
                     `http://${window.location.hostname}:8080/api`;

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
  getTagCloud: () => api.get('/tags/cloud'),
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

// 이미지 API
export const imageApi = {
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
  
  getImageUrl: (postId, imageId) => {
    return `${API_BASE_URL}/posts/${postId}/images/${imageId}`;
  },
  
  getPostImages: (postId) => api.get(`/posts/${postId}/images`),
  
  deleteImage: (postId, imageId) => api.delete(`/posts/${postId}/images/${imageId}`),
};

// 워드클라우드 API 추가
export const wordCloudApi = {
  // 워드클라우드 이미지 URL
  getImageUrl: () => `${API_BASE_URL}/wordcloud/image?t=${Date.now()}`,
  
  // 워드클라우드 수동 재생성
  generate: () => api.post('/wordcloud/generate'),
};

export default api;