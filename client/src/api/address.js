import api from "./axios";

export const createAddress = (data) =>
  api.post("/api/address", data);

export const getAddresses = () =>
  api.get("/api/address");

export const updateAddress = (id, data) =>
  api.put(`/api/address/${id}`, data);

export const deleteAddress = (id) =>
  api.delete(`/api/address/${id}`);