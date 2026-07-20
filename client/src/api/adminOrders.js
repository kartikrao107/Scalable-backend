import api from "./axios";

export const getAllOrders = () =>
  api.get("/api/orders/admin/all");
export const updateOrderStatus = (id, status) =>
    api.put(`/api/orders/admin/${id}/status`, {
        status,
    });