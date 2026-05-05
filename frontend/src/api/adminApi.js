import { httpClient } from "./httpClient";

export const adminApi = {
  async getAllUsers() {
    const { data } = await httpClient.get("/users");
    return data;
  },

  async toggleUserActive(userId) {
    const { data } = await httpClient.put(`/users/${userId}/toggle-active`);
    return data;
  },
};
