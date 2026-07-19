import api from './axios';

export const createReview = (data) => api.post('/api/review/', data);
export const getReviews = (productId) => api.get(`/api/review/${productId}`);
export const updateReview = (id, data) => api.put(`/api/review/${id}`, data);
export const deleteReview = (id) => api.delete(`/api/review/${id}`);
