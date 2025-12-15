import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { roomAPI, hotelAPI, resolveAsset } from "../utils/api";
import ImageUploaderMulti from "../components/ImageUploaderMulti";

export default function HotelRooms() {
  // id trong URL chính là hotel_id (Mongo ObjectId dạng string)
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    room_number: "",
    room_type: "",
    price: "",
    capacity: 2,
    description: "",
    image_urls: [],
    amenitiesText: "",
  });

  const multiTextRef = useRef(null);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      room_number: "",
      room_type: "",
      price: "",
      capacity: 2,
      description: "",
      image_urls: [],
      amenitiesText: "",
    });
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [h, r] = await Promise.all([
          hotelAPI.getById(id),
          roomAPI.getByHotelId(id),
        ]);
        setHotel(h.data.hotel);
        setRooms(r.data.rooms || []);
      } catch (err) {
        alert(err?.response?.data?.message || "Lỗi tải danh sách phòng");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const openCreate = () => {
    resetForm();
    setOpen(true);
  };

  const openEdit = (room) => {
    setEditingId(room.id);
    let amenitiesText = "";
    try {
      amenitiesText = Array.isArray(room.amenities)
        ? room.amenities.join(", ")
        : Array.isArray(JSON.parse(room.amenities || "[]"))
        ? JSON.parse(room.amenities || "[]").join(", ")
        : "";
    } catch {
      amenitiesText = "";
    }

    let imageUrls = [];
    try {
      if (Array.isArray(room.image_urls)) {
        imageUrls = room.image_urls;
      } else if (typeof room.image_urls === "string" && room.image_urls) {
        imageUrls = JSON.parse(room.image_urls);
      }
    } catch {
      imageUrls = [];
    }

    const allImages = [
      ...(room.image_url ? [room.image_url] : []),
      ...imageUrls,
    ].filter(Boolean);

    setForm({
      room_number: room.room_number || "",
      room_type: room.room_type || "",
      price: room.price || "",
      capacity: room.capacity || 2,
      description: room.description || "",
      image_urls: allImages,
      amenitiesText,
    });
    setOpen(true);
  };

  const addMultiByText = () => {
    const raw = multiTextRef.current?.value?.trim();
    if (!raw) return;
    const parts = raw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((s) => ({
      ...s,
      image_urls: [...s.image_urls, ...parts].slice(0, 10),
    }));
    multiTextRef.current.value = "";
  };

  const submitRoom = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const [firstImage, ...restImages] = form.image_urls;

      const payload = {
        // ⭐ GỬI THẲNG id (string) cho backend
        hotel_id: id,
        room_number: form.room_number || null,
        room_type: form.room_type,
        price: Number(form.price) || 0,
        capacity: Number(form.capacity) || 1,
        description: form.description,
        image_url: firstImage || "",
        image_urls: restImages,
        amenities: form.amenitiesText
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await roomAPI.update(editingId, payload);
      } else {
        await roomAPI.create(payload);
      }

      const r = await roomAPI.getByHotelId(id);
      setRooms(r.data.rooms || []);
      setOpen(false);
      resetForm();
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi lưu phòng");
    } finally {
      setSaving(false);
    }
  };

  const removeRoom = async (roomId) => {
    if (!window.confirm("Xóa phòng này?")) return;
    try {
      await roomAPI.delete(roomId);
      setRooms((s) => s.filter((x) => x.id !== roomId));
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi xóa phòng");
    }
  };

  if (loading) return <div className="p-8">Đang tải…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Phòng của khách sạn: {hotel?.name}
        </h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md"
          onClick={openCreate}
        >
          + Thêm phòng
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          Chưa có phòng nào. Hãy bấm "Thêm phòng".
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((r) => {
            let imageUrls = [];
            try {
              if (Array.isArray(r.image_urls)) {
                imageUrls = r.image_urls;
              } else if (typeof r.image_urls === "string" && r.image_urls) {
                imageUrls = JSON.parse(r.image_urls);
              }
            } catch {
              imageUrls = [];
            }

            const allThumbs = [
              ...(r.image_url ? [r.image_url] : []),
              ...imageUrls,
            ].filter(Boolean);

            return (
              <div key={r.id} className="bg-white rounded-xl shadow p-4">
                <img
                  src={
                    resolveAsset(allThumbs[0]) ||
                    "https://via.placeholder.com/600x360"
                  }
                  className="w-full h-40 object-cover rounded-lg"
                  alt={r.room_type}
                />
                {allThumbs.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {allThumbs.slice(1, 7).map((t, i) => (
                      <img
                        key={i}
                        src={resolveAsset(t)}
                        className="w-16 h-12 object-cover rounded border"
                      />
                    ))}
                    {allThumbs.length > 7 && (
                      <div className="w-16 h-12 bg-gray-100 rounded border flex items-center justify-center text-xs">
                        +{allThumbs.length - 7}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-3">
                  <div className="font-semibold">
                    {r.room_type} {r.room_number ? `• ${r.room_number}` : ""}
                  </div>
                  <div className="text-sm text-gray-600">
                    Tối đa {r.capacity} khách
                  </div>
                  <div className="text-blue-600 font-semibold mt-1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(r.price)}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEdit(r)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => removeRoom(r.id)}
                    className="px-3 py-2 bg-red-600 text-white rounded-md"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal tạo / sửa phòng */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
          <form
            onSubmit={submitRoom}
            className="bg-white w-full max-w-2xl rounded-xl p-5 space-y-4 m-4"
          >
            <div className="text-lg font-semibold">
              {editingId ? "Sửa phòng" : "Thêm phòng"}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Số phòng
                </label>
                <input
                  name="room_number"
                  value={form.room_number}
                  className="mt-1 w-full border rounded-md p-2"
                  onChange={onChange}
                  placeholder="Ví dụ: 101, A-201"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Loại phòng <span className="text-red-500">*</span>
                </label>
                <input
                  name="room_type"
                  required
                  value={form.room_type}
                  className="mt-1 w-full border rounded-md p-2"
                  onChange={onChange}
                  placeholder="Ví dụ: Deluxe, Suite"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Giá (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  value={form.price}
                  className="mt-1 w-full border rounded-md p-2"
                  onChange={onChange}
                  placeholder="1000000"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Sức chứa
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={form.capacity}
                  className="mt-1 w-full border rounded-md p-2"
                  onChange={onChange}
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  rows="2"
                  value={form.description}
                  className="mt-1 w-full border rounded-md p-2"
                  onChange={onChange}
                  placeholder="Mô tả về phòng..."
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Album ảnh phòng (ảnh đầu tiên sẽ là ảnh bìa)
                </label>
                <ImageUploaderMulti
                  uploadPath="/rooms/upload-images"
                  values={form.image_urls}
                  onChange={(vals) =>
                    setForm((s) => ({ ...s, image_urls: vals }))
                  }
                  label=""
                  max={10}
                />

                <div className="flex items-start gap-2 mt-3">
                  <input
                    ref={multiTextRef}
                    placeholder="Hoặc dán nhiều URL, cách nhau bằng phẩy hoặc xuống dòng"
                    className="flex-1 border rounded-md p-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addMultiByText}
                    className="px-3 py-2 bg-gray-100 border rounded-md hover:bg-gray-200 text-sm"
                  >
                    Thêm
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  💡 Ảnh đầu tiên sẽ là ảnh bìa. Kéo thả để sắp xếp lại thứ tự.
                  Tối đa 10 ảnh.
                </p>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Tiện nghi (phân cách bằng dấu phẩy)
                </label>
                <input
                  name="amenitiesText"
                  value={form.amenitiesText}
                  className="mt-1 w-full border rounded-md p-2"
                  onChange={onChange}
                  placeholder="Ví dụ: King bed, City view, Smart TV, Mini bar"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Đang lưu…" : editingId ? "Cập nhật" : "Tạo phòng"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
