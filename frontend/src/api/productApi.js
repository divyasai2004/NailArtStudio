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
};

