import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (backend not running)
    if (!error.response) {
      console.warn('Network error - backend may not be running');
      // Don't redirect for network errors, just reject
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// User APIs
export const userAPI = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`)
};

// Student APIs
export const studentAPI = {
  getStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  getStudentById: (studentId) => api.get(`/students/by-id/${studentId}`),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  getClasses: () => api.get('/students/classes')
};

// Transaction APIs
export const transactionAPI = {
  createDeposit: (data) => api.post('/transactions/deposits', data),
  createPurchase: (data) => api.post('/transactions/purchase', data),
  createWithdrawal: (data) => api.post('/transactions/withdraw', data),
  getTransactions: (params) => api.get('/transactions', { params }),
  getDashboardStats: () => api.get('/transactions/dashboard'),
  getReports: (params) => api.get('/transactions/reports', { params })
};

// Class APIs
export const classAPI = {
  getClasses: () => api.get('/classes'),
  createClass: (data) => api.post('/classes', data),
  updateClass: (id, data) => api.put(`/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/classes/${id}`),
  getClassStats: () => api.get('/classes/stats')
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
  getMessages: (params) => api.get('/chat', { params }),
  getChatUsers: () => api.get('/chat/users'),
  getUnreadCount: () => api.get('/chat/unread'),
  markAsRead: (id) => api.put(`/chat/${id}/read`)
};

export default api;
