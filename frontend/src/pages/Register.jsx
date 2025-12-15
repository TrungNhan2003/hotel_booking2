import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/login-background-gradient-style.jpg";

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        full_name: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Mật khẩu xác nhận không khớp");
        }

        if (formData.password.length < 6) {
            return setError("Mật khẩu phải có ít nhất 6 ký tự");
        }

        setLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate("/");
        } catch (err) {
            setError(err?.response?.data?.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 sm:px-6"
            style={{ backgroundImage: `url("${bg}")` }}
        >
            <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-12 py-10">

                {/* LEFT: REGISTER FORM */}
                <div className="w-full md:w-[430px] bg-white/80 backdrop-blur-xl shadow-xl border border-white/40 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Tạo tài khoản mới
                    </h2>

                    <p className="text-sm text-gray-600 mb-6">
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            đăng nhập ngay
                        </Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Họ tên */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                required
                                value={formData.full_name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nguyễn Văn A"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="example@email.com"
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="0123456789"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Tối thiểu 6 ký tự"
                            />
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </button>
                    </form>
                </div>

                {/* RIGHT: SLOGAN */}
                <div className="text-gray-900 max-w-xl">
                    <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-sm">
                        Tham gia cùng chúng tôi<br />
                        và khám phá hàng ngàn lựa chọn ✨
                    </h1>

                    <div className="h-1 w-16 bg-blue-600 rounded-full mb-6"></div>

                    <ul className="space-y-4 text-[16px] text-gray-700">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">🏨</span>
                            Hàng nghìn khách sạn trên toàn quốc — chất lượng uy tín
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">⚡</span>
                            Đăng ký nhanh chóng — trải nghiệm liền tay
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">🌟</span>
                            Hỗ trợ 24/7 — luôn đồng hành cùng bạn
                        </li>
                    </ul>

                    <p className="mt-10 text-xs text-gray-600">
                        Khi đăng ký, bạn đồng ý với{" "}
                        <span className="text-blue-600 underline cursor-pointer">Điều khoản dịch vụ</span>{" "}
                        và{" "}
                        <span className="text-blue-600 underline cursor-pointer">Chính sách bảo mật</span>.
                    </p>
                </div>

            </div>
        </div>
    );
}
