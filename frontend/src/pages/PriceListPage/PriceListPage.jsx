import { useState } from 'react';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import DatePicker from '../../components/ui/DatePicker';
import Modal from '../../components/ui/Modal';

const ROOM_CATEGORIES = [
  { value: '', label: '-- Chọn loại phòng --' },
  { value: 'standard', label: 'Standard' },
  { value: 'deluxe', label: 'Deluxe' },
  { value: 'suite', label: 'Suite' },
];

const INITIAL_PRICE_LISTS = [
  {
    id: 1,
    roomCategoryId: 'standard',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    price: 1200000,
  },
  {
    id: 2,
    roomCategoryId: 'deluxe',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    price: 1800000,
  },
  {
    id: 3,
    roomCategoryId: 'suite',
    startDate: '2026-11-01',
    endDate: '2026-11-30',
    price: 2800000,
  },
];

const EMPTY_FORM = {
  roomCategoryId: '',
  startDate: '',
  endDate: '',
  price: '',
};

const formatPrice = (price) =>
  `${new Intl.NumberFormat('vi-VN').format(price)} đ`;

const formatDate = (date) => {
  if (!date) return '';
  return date.split('-').reverse().join('/');
};

function PriceListPage() {
  const [priceLists, setPriceLists] = useState(INITIAL_PRICE_LISTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  const getCategoryName = (categoryId) =>
    ROOM_CATEGORIES.find((category) => category.value === categoryId)?.label ||
    categoryId;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({
      roomCategoryId: item.roomCategoryId,
      startDate: item.startDate,
      endDate: item.endDate,
      price: String(item.price),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormError('');

    if (form.endDate < form.startDate) {
      setFormError('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.');
      return;
    }

    const newData = {
      roomCategoryId: form.roomCategoryId,
      startDate: form.startDate,
      endDate: form.endDate,
      price: Number(form.price),
    };

    if (editingId) {
      setPriceLists((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...newData,
              }
            : item
        )
      );
    } else {
      setPriceLists((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...newData,
        },
      ]);
    }

    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-text-on-dark border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <p className="text-accent text-xs font-bold uppercase tracking-[0.2em]">
            Sương Mai Hotel
          </p>

          <h1 className="font-headline text-3xl font-bold mt-1">
            Quản lý bảng giá phòng
          </h1>

          <p className="text-text-on-dark/70 text-sm mt-2">
            Thiết lập giá phòng theo loại phòng và khoảng thời gian.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-headline text-2xl font-bold text-primary">
              Danh sách bảng giá
            </h2>

            <p className="text-sm text-text-secondary mt-1">
              Có {priceLists.length} bảng giá hiện tại.
            </p>
          </div>

          <Button
            onClick={openCreateForm}
            iconLeft="add"
          >
            Tạo bảng giá mới
          </Button>
        </div>

        <div className="bg-surface rounded-2xl border border-border-custom shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead className="bg-surface-alt/60">
                <tr className="text-left">
                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                    Loại phòng
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                    Ngày bắt đầu
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                    Ngày kết thúc
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary">
                    Giá tiền
                  </th>

                  <th className="px-6 py-4 text-xs uppercase tracking-wider text-text-secondary text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-custom">
                {priceLists.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-background/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary">
                        {getCategoryName(item.roomCategoryId)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatDate(item.startDate)}
                    </td>

                    <td className="px-6 py-4 text-sm text-text-secondary">
                      {formatDate(item.endDate)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-success-custom">
                        {formatPrice(item.price)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        iconLeft="edit"
                        onClick={() => openEditForm(item)}
                      >
                        Chỉnh sửa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Chỉnh sửa bảng giá' : 'Tạo bảng giá mới'}
        subtitle="Thiết lập loại phòng, khoảng ngày áp dụng và giá tiền."
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <Select
            id="roomCategory"
            label="Loại phòng"
            value={form.roomCategoryId}
            onChange={handleChange('roomCategoryId')}
            options={ROOM_CATEGORIES}
            required
            icon="hotel"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatePicker
              id="startDate"
              label="Ngày bắt đầu"
              value={form.startDate}
              onChange={handleChange('startDate')}
              required
            />

            <DatePicker
              id="endDate"
              label="Ngày kết thúc"
              value={form.endDate}
              onChange={handleChange('endDate')}
              required
            />
          </div>

          <Input
            id="price"
            label="Giá tiền"
            type="number"
            value={form.price}
            onChange={handleChange('price')}
            placeholder="Ví dụ: 1500000"
            icon="payments"
            min="0"
            step="1000"
            required
            helperText="Đơn vị: VNĐ / đêm"
          />

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-semibold text-red-600">
                {formError}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-border-custom">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              iconLeft="save"
            >
              {editingId ? 'Lưu thay đổi' : 'Tạo bảng giá'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default PriceListPage;