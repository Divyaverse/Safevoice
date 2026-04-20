import axios from "axios";

// Using the vite environment variable for the backend base URL (default to localhost 5000 if not set)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

/**
 * Note on UX/Architecture:
 * The frontend instructions suggested calling getUploadUrl() to PUT directly to S3.
 * However, since the backend uses Multer to wrap the file upload and complaint 
 * creation into a single atomic S3 multipart request, we combine the upload 
 * into one direct call to prevent modifying the existing backend structure.
 */

// Fetches overall system analytics (total, pending, resolved counts)
export const getAnalytics = async () => {
  const response = await api.get("/analytics");
  return response.data;
};

// Gets all complaints for the admin dashboard
export const getComplaints = async () => {
  const response = await api.get("/complaints");
  return response.data;
};

// Fetches a specific tracked complaint by its generated SV-XXXXX ID
export const getComplaintById = async (id) => {
  const response = await api.get(`/complaint/${id}`);
  return response.data;
};

// Submits a complaint, cleanly handling multipart/form-data structure automatically via Axios when passed a FormData object
export const submitComplaint = async (formDataPayload) => {
  const response = await api.post("/complaint", formDataPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// Update complaint status (Admin dashboard)
export const updateComplaintStatus = async (id, status) => {
  const response = await api.put(`/complaint/${id}`, { status });
  return response.data;
};

export default api;
