import { httpClient } from "./httpClient";

export const productApi = {
  async getProducts(params = {}) {
    const { data } = await httpClient.get("/products", { params });
    return data;
  },

  async getProductById(productId) {
    const { data } = await httpClient.get(`/products/${productId}`);
    return data;
  },

  async getProductBySlug(slug) {
    const { data } = await httpClient.get(`/products/slug/${slug}`);
    return data;
  },

  async createProduct(payload) {
    const { data } = await httpClient.post("/products", payload);
    return data;
  },

  async updateProduct(productId, payload) {
    const { data } = await httpClient.put(`/products/${productId}`, payload);
    return data;
  },

  async deleteProduct(productId) {
    const { data } = await httpClient.delete(`/products/${productId}`);
    return data;
  },

  async createProductReview(productId, payload) {
    const { data } = await httpClient.post(`/products/${productId}/reviews`, payload);
    return data;
  },
};
