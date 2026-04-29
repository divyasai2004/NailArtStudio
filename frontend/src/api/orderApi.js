import { httpClient } from "./httpClient";

export const orderApi = {
  async createCodOrder(payload) {
    const { data } = await httpClient.post("/orders", payload);
    return data;
  },

  async getMyOrders() {
    const { data } = await httpClient.get("/orders/my-orders");
    return data;
  },
};

