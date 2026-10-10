import axios from 'axios';

const API_BASE = '/api';

const getAuthToken = () =>
  localStorage.getItem('authToken') ||
  sessionStorage.getItem('authToken');

const getAuthConfig = () => {
  const token = getAuthToken();

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};
};

export const getRoomCategories = async () => {
  const response = await axios.get(
    `${API_BASE}/price-lists/room-categories`,
    getAuthConfig()
  );

  return response.data;
};

export const createPriceList = async (data) => {
  const response = await axios.post(
    `${API_BASE}/price-lists`,
    data,
    getAuthConfig()
  );

  return response.data;
};

export const updatePriceList = async (id, data) => {
  const response = await axios.put(
    `${API_BASE}/price-lists/${id}`,
    data,
    getAuthConfig()
  );

  return response.data;
};