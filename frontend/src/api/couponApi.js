import { httpClient } from "./httpClient";

export const couponApi = {
  async createCoupon(payload) {
    const { data } = await httpClient.post("/coupons", payload);
    return data;
  },

  async updateCoupon(id, payload) {
    const { data } = await httpClient.put(`/coupons/${id}`, payload);
    return data;
  },

  async deleteCoupon(id) {
    const { data } = await httpClient.delete(`/coupons/${id}`);
    return data;
  },

  async getAllCoupons() {
    const { data } = await httpClient.get("/coupons");
    return data;
  },

  async validateCoupon(payload) {
    // payload: { code, orderAmount }
    const { data } = await httpClient.post("/coupons/validate", payload);
    return data;
  },
};
