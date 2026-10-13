import axios from 'axios';

const API_BASE = '/api';

/**
 * Lấy danh sách toàn bộ phòng và hình ảnh thực tế từ Database (bảng phong & phong_hinh_anh)
 */
export const getPublicRooms = async () => {
  try {
    const response = await axios.get(`${API_BASE}/rooms/public`);
    return response.data;
  } catch (error) {
    console.warn('Không thể tải danh sách phòng từ database:', error);
    return [];
  }
};

/**
 * Lấy chi tiết một phòng kèm bộ ảnh từ Database
 */
export const getPublicRoomDetail = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/rooms/public/${id}`);
    return response.data;
  } catch (error) {
    console.warn(`Không thể tải chi tiết phòng ${id} từ database:`, error);
    return null;
  }
};
