import api from './axios';

export const signup = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getProfile = () => api.post('/api/auth/profile');
