import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            // GỌI API THẬT
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username: username,
                password: password
            });

            const userData = response.data;
            console.log("Dữ liệu đăng nhập nhận được:", userData);
            if (!userData || !userData.role) {
                setError("Dữ liệu server trả về không đúng cấu trúc!");
                return;
            }
            // Lưu vào Context
            login(userData);

            // PHÂN QUYỀN ĐIỀU HƯỚNG DỰA TRÊN ROLE THẬT TỪ DATABASE
            // Kiểm tra cả 'ROLE_ADMIN' (chuẩn Spring) hoặc 'ADMIN'
            if (userData.role === 'ROLE_ADMIN' || userData.role === 'ADMIN') {
                console.log("Là Admin -> Đi tới trang Quản trị");
                navigate('/admin');
            } else {
                console.log("Là User bình thường -> Về trang chủ");
                navigate('/');
            }

        } catch (err) {
            if (err.code === 'ERR_NETWORK') {
                setError("Lỗi kết nối: Bạn đã bật Server Backend (port 8080) chưa?");
            } else if (err.response && err.response.status === 401) {
                setError("Tài khoản hoặc mật khẩu không đúng!");
            } else {
                setError("Đã xảy ra lỗi hệ thống!");
            }
            console.error("Chi tiết lỗi:", err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="card shadow p-4" style={{ width: '400px', backgroundColor: '#212529', color: 'white' }}>
                <h3 className="text-center mb-4 fw-bold">Đăng nhập hệ thống</h3>

                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-secondary small">Tài khoản</label>
                        <input className="form-control bg-dark text-white border-secondary"
                            value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-secondary small">Mật khẩu</label>
                        <input className="form-control bg-dark text-white border-secondary" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mt-3">Vào hệ thống</button>
                </form>
            </div>
        </div>
    );
};

export default Login;