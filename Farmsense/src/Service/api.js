import axios from 'axios';

const API_URL = 'http://localhost:8080';
const AUTH_URL = `${API_URL}/auth`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const productService = {
  getAllProducts: () => api.get('/auth/products'),
  getProductById: (id) => api.get(`/auth/products/${id}`),
  addProduct: (productData) => api.post('/auth/products', productData),
  updateProduct: (id, productData) => api.put(`/auth/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/auth/products/${id}`),
  banProduct: (id) => api.put(`/auth/products/${id}/ban`),
};

export const alertService = {
  getAllAlerts: () => api.get('/auth/products/alerts'),
  getLowStockAlerts: () => api.get('/auth/products/alerts/low-stock'),
  getExpiryAlerts: () => api.get('/auth/products/alerts/expiry'),
};

export default api;
