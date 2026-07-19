import api from './axios';

export const createCoupon = (data) => api.post('/api/coupon/', data);
export const getCoupons = () => api.get('/api/coupon/');
export const applyCoupon = (data) => api.post('/api/coupon/apply', data);
export const deleteCoupon = (id) => api.delete(`/api/coupon/${id}`);
