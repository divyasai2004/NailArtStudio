import { httpClient } from "./httpClient";

export const orderApi = {
  async createCodOrder(payload) {
    const { data } = await httpClient.post("/orders", payload);
    return data;
  },

  async createRazorpayOrder(payload) {
    const { data } = await httpClient.post("/orders/payment/razorpay/order", payload);
    return data;
  },

  async verifyRazorpayPayment(payload) {
    const { data } = await httpClient.post("/orders/payment/razorpay/verify", payload);
    return data;
  },

  async getMyOrders() {
    const { data } = await httpClient.get("/orders/my-orders");
    return data;
  },

  async getOrderById(orderId) {
    const { data } = await httpClient.get(`/orders/${orderId}`);
    return data;
  },

  async getAllOrders() {
    const { data } = await httpClient.get("/orders");
    return data;
  },

  async updateOrderStatus(orderId, payload) {
    const { data } = await httpClient.put(`/orders/${orderId}/status`, payload);
    return data;
  },
};
