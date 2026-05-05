import { httpClient } from "./httpClient";

export const authApi = {
  async register(payload) {
    const { data } = await httpClient.post("/users/register", payload);
    return data;
  },

  async login(payload) {
    const { data } = await httpClient.post("/users/login", payload);
    return data;
  },

  async getMyProfile() {
    const { data } = await httpClient.get("/users/me");
    return data;
  },
};

