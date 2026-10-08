function SystemCheckPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800">Kiểm Tra Hệ Thống</h1>
        <p className="text-gray-500 text-sm text-center">
          Nhấn nút bên dưới để kiểm tra trạng thái kết nối hệ thống.
        </p>
        <button
          className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors duration-200 w-full"
          onClick={() => alert('Hệ thống hoạt động bình thường!')}
        >
          Kiểm Tra Hệ Thống
        </button>
      </div>
    </div>
  );
}

export default SystemCheckPage;
