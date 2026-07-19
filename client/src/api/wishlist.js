import api from './axios';

export const addToWishlist = (data) => api.post('/api/wishlist/addwishlist', data);
export const getWishlist = () => api.get('/api/wishlist/getwishlist');
export const removeFromWishlist = (id) => api.delete(`/api/wishlist/${id}`);
