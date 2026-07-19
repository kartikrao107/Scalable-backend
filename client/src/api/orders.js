import api from './axios';

export const placeOrder = (data) => api.post('/api/orders/', data);
export const getOrders = () => api.get('/api/orders/');
export const getOrder = (id) => api.get(`/api/orders/${id}`);
export const cancelOrder = (id) => api.put(`/api/orders/${id}/cancel`);
