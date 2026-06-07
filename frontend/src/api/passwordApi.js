import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

export async function generatePasswords(options) {
  const { data } = await axios.post(`${BASE}/api/generate`, options);
  return data.passwords;
}

export async function evaluateStrength(password) {
  const { data } = await axios.post(`${BASE}/api/strength`, { password });
  return data;
}
