// Centralized API Service for future Backend Connection (Firebase / Node)
import axios from "axios";

// Create Instance
const API_URL = "https://your-backend-api.com/api";

export const getTasks = async () => {
  // const res = await axios.get(`${API_URL}/tasks`);
  // return res.data;
  console.log("Mock calling API: GET TASKS");
};

export const sendMessage = async (data) => {
  // return await axios.post(`${API_URL}/messages`, data);
  console.log("Mock calling API: POST MESSAGE", data);
};
