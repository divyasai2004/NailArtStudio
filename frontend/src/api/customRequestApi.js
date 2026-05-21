import { httpClient } from "./httpClient";

export const customRequestApi = {
  // Public (or user) route
  createRequest: async (data) => {
    const response = await httpClient.post("/custom-requests", data);
    return response.data;
  },

  // Admin routes
  getRequests: async () => {
    const response = await httpClient.get("/custom-requests");
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await httpClient.put(`/custom-requests/${id}`, { status });
    return response.data;
  },
};
