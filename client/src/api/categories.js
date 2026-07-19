import api from './axios';

export const getCategories = () => api.get('/api/category/getCategories');
export const createCategory = (data) => api.post('/api/category/createCategory', data);
export const updateCategory = (id, data) => api.put(`/api/category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/api/category/${id}`);
