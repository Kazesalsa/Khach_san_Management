import { useState } from 'react';
import axios from 'axios';

function SystemCheckPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckSystem = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await axios.get('http://localhost:8080/api/test');

      setMessage(response.data.message);
    } catch (err) {
      console.error('Lỗi khi gọi API:', err);
      setError('Không thể kết nối tới Backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Kiểm Tra Hệ Thống
        </h1>

        <p className="text-gray-500 text-sm text-center">
          Nhấn nút bên dưới để kiểm tra trạng thái kết nối hệ thống.
        </p>

        <button
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200 w-full"
          onClick={handleCheckSystem}
          disabled={loading}
        >
          {loading ? 'Đang kiểm tra...' : 'Kiểm Tra Hệ Thống'}
        </button>

        {message && (
          <p className="text-green-600 font-semibold text-center">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-600 font-semibold text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default SystemCheckPage;