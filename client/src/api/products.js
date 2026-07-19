import api from './axios';

export const getProducts = (params) => api.get('/api/product/getProducts', { params });
export const getProduct = (id) => api.get(`/api/product/getproduct/${id}`);
export const createProduct = (formData) =>
  api.post('/api/product/createProduct', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateProduct = (id, data) => api.put(`/api/product/updateproduct/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/product/delete/${id}`);
