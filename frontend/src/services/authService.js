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

export async function register(email, password, confirmPassword) {
  const response = await axios.post(`${AUTH_API}/register`, {
    email: email.trim(),
    password,
    confirmPassword,
  });

  return response.data;
}

export async function forgotPassword(email) {
  const response = await axios.post(`${AUTH_API}/forgot-password`, {
    email: email.trim(),
  });

  return response.data;
}