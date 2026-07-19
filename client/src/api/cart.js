import api from './axios';

export const addToCart = (data) => api.post('/api/cart/add', data);
export const getCart = () => api.get('/api/cart/getcart');
export const updateCartItem = (itemId, data) => api.put(`/api/cart/${itemId}`, data);
export const removeFromCart = (itemId) => api.delete(`/api/cart/${itemId}`);
export const clearCart = () => api.delete('/api/cart/clear');
