import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Thêm loading để chặn spam click

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // 1. Validate Client-side cơ bản
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        if (cleanUsername.length < 3) {
            setError("Tài khoản phải có ít nhất 3 ký tự!");
            return;
        }
        if (cleanPassword.length < 4) {
            setError("Mật khẩu phải có ít nhất 4 ký tự!");
            return;
        }

        setLoading(true); // Bắt đầu gửi request

        try {
            const response = await axiosClient.post("/auth/login", {
                username: cleanUsername,
                password: cleanPassword
            });

            const userData = response.data;
            console.log("Dữ liệu đăng nhập nhận được:", userData);

            // Kiểm tra cấu trúc dữ liệu từ Server
            if (!userData || !userData.role) {
                setError("Dữ liệu server trả về không đúng cấu trúc!");
                setLoading(false);
                return;
            }

            // Gọi hàm login từ Context để lưu vào localStorage
            login(userData);

            // Phân quyền điều hướng
            if (userData.role === 'ROLE_ADMIN' || userData.role === 'ADMIN') {
                console.log("Là Admin -> Đi tới trang Quản trị");
                navigate('/admin');
            } else {
                console.log("Là User bình thường -> Về trang chủ");
                navigate('/');
            }

        } catch (err) {
            // Xử lý các loại lỗi từ Server hoặc Network
            if (err.code === 'ERR_NETWORK') {
                setError("Lỗi kết nối: Bạn đã bật Server Backend (port 8080) chưa?");
            } else if (err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu không đúng!");
            } else {
                setError("Đã xảy ra lỗi hệ thống!");
            }
            console.error("Chi tiết lỗi:", err);
        } finally {
            setLoading(false); // Luôn tắt loading kể cả khi thành công hay thất bại
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow p-4" style={{ width: '400px', backgroundColor: '#212529', color: 'white' }}>
                <h3 className="text-center mb-4 fw-bold">Đăng nhập hệ thống</h3>

                {/* Hiển thị thông báo lỗi nếu có */}
                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-secondary small">Tài khoản</label>
                        <input
                            className="form-control bg-dark text-white border-secondary shadow-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary small">Mật khẩu</label>
                        <input
                            className="form-control bg-dark text-white border-secondary shadow-none"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Nút Đăng nhập: Sẽ hiển thị trạng thái đang xử lý và bị vô hiệu hóa khi loading */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2 mt-3"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : null}
                        {loading ? "Đang xử lý..." : "Vào hệ thống"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-secondary small mb-0">Chưa có tài khoản?</p>
                        <Link to="/register" className="text-info text-decoration-none small fw-bold">
                            Tạo tài khoản mới ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;