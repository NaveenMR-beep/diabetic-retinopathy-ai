import axios from "axios";

const rawUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_BASE_URL = rawUrl.replace(/\/+$/, "");

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

/**
 * Uploads a retinal image to the backend /predict endpoint.
 * Returns the parsed JSON response on success.
 * Throws an Error with a human-readable message on failure.
 */
export async function analyzeRetinalImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await client.post("/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.detail) {
      const detail = err.response.data.detail;
      if (typeof detail === "string") {
        throw new Error(detail);
      }
      if (detail.message) {
        throw new Error(detail.message);
      }
    }
    if (err.code === "ECONNABORTED") {
      throw new Error("The analysis took too long to complete. Please try again.");
    }
    if (err.message && err.message.includes("Network Error")) {
      throw new Error(
        "Unable to reach the analysis server. Please confirm the backend is running at " +
          API_BASE_URL
      );
    }
    throw new Error("Unable to process this image. Please try again.");
  }
}

export async function fetchModelInfo() {
  const response = await client.get("/model-info");
  return response.data;
}

export async function fetchHealth() {
  const response = await client.get("/health");
  return response.data;
}

export { API_BASE_URL };
