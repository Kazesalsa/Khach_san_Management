import axios from "axios";

const AUTH_API = "/api/auth";

export async function login(username, password) {
  const response = await axios.post(`${AUTH_API}/login`, {
    username,
    password,
  });

  return response.data;
}

export async function getCurrentProfile(token) {
  const response = await axios.get(`${AUTH_API}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}