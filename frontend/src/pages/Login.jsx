import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/login-background-gradient-style.jpg";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = await login(email, password, remember);
            navigate(user.role === "admin" ? "/admin" : "/");
        } catch (err) {
            setError(err?.response?.data?.message || "Đăng nhập thất bại");
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

                {/* LEFT: LOGIN FORM */}
                <div className="w-full md:w-[430px] bg-white/80 backdrop-blur-xl shadow-xl border border-white/40 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Đăng nhập vào tài khoản
                    </h2>

                    <p className="text-sm text-gray-600 mb-6">
                        Hoặc{" "}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">
                            đăng ký tài khoản mới
                        </Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập email của bạn"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        {/* Remember me */}
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                            />
                            Ghi nhớ đăng nhập
                        </label>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 transition disabled:opacity-50"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>
                    </form>
                </div>

                {/* RIGHT: SLOGAN */}
                <div className="text-gray-900 max-w-xl">
                    <h1 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-sm">
                        Trải nghiệm đặt phòng dễ dàng <br />
                        thoải mái ngay từ cú click đầu tiên ✨
                    </h1>

                    <div className="h-1 w-16 bg-blue-600 rounded-full mb-6"></div>

                    <ul className="space-y-4 text-[16px] text-gray-700">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">✓</span>
                            Có mặt tại hơn 6 thành phố lớn trên cả nước: Hà Nội, Đà Nẵng, Vũng Tàu, Đà Lạt, TP.HCM, Nha Trang
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">⚡</span>
                            Đặt phòng siêu tốc — xác nhận chỉ trong 2 phút
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="text-blue-600 text-xl">🏨</span>
                            Hình ảnh đúng thực tế — đối tác uy tín, chất lượng kiểm chứng
                        </li>
                    </ul>

                    <p className="mt-10 text-xs text-gray-600">
                        Bằng việc đăng nhập hoặc đăng ký, bạn đồng ý với{" "}
                        <span className="text-blue-600 underline cursor-pointer">
              Điều khoản dịch vụ
            </span>{" "}
                        và{" "}
                        <span className="text-blue-600 underline cursor-pointer">
              Chính sách bảo mật
            </span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
