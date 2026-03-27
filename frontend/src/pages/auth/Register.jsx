import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const Register = () => {
    const [formData, setFormData] = useState({
        username: "", password: "", confirmPassword: "",
        email: "", phone: "", address: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        // CHẶN NHẬP CHỮ VÀO Ô SỐ ĐIỆN THOẠI
        if (name === "phone") {
            // Chỉ giữ lại các ký tự là số
            const onlyNums = value.replace(/[^0-9]/g, '');
            setFormData({ ...formData, [name]: onlyNums });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        // --- VALIDATE LOGIC ---

        // 1. Kiểm tra mật khẩu khớp
        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }

        // 2. Validate Số điện thoại (Định dạng Việt Nam: 10 số, bắt đầu bằng số 0)
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            setError("Số điện thoại không đúng định dạng (phải có 10 số và bắt đầu bằng 03, 05, 07, 08, hoặc 09)!");
            return;
        }

        // 3. Validate độ dài mật khẩu
        if (formData.password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        setLoading(true);
        try {
            await axiosClient.post("/auth/register", {
                username: formData.username.trim(),
                password: formData.password,
                email: formData.email.trim(),
                phone: formData.phone,
                address: formData.address.trim()
            });

            alert("🎉 Đăng ký thành công! Mời bạn đăng nhập.");
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            // Xử lý lỗi từ backend linh hoạt (object hoặc string)
            const msg = (data && typeof data === 'object' && data.message) ? data.message : data;
            setError(msg || "Lỗi kết nối hệ thống!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
            <div className="card shadow-lg p-4" style={{ width: '450px', backgroundColor: '#212529', color: 'white', borderRadius: '15px' }}>
                <h3 className="text-center mb-4 fw-bold text-primary">Tạo tài khoản mới</h3>

                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label text-secondary small">Tài khoản</label>
                        <input name="username" className="form-control bg-dark text-white border-secondary shadow-none" value={formData.username} onChange={handleChange} required placeholder="Tên đăng nhập..." />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary small">Email</label>
                        <input name="email" type="email" className="form-control bg-dark text-white border-secondary shadow-none" value={formData.email} onChange={handleChange} required placeholder="example@gmail.com" />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-secondary small">Mật khẩu</label>
                            <input name="password" type="password" className="form-control bg-dark text-white border-secondary shadow-none" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-secondary small">Xác nhận</label>
                            <input name="confirmPassword" type="password" className="form-control bg-dark text-white border-secondary shadow-none" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary small">Số điện thoại</label>
                        <input
                            name="phone"
                            type="text"
                            maxLength="10"
                            className="form-control bg-dark text-white border-secondary shadow-none"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập 10 số điện thoại..."
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-secondary small">Địa chỉ</label>
                        <textarea name="address" rows="2" className="form-control bg-dark text-white border-secondary shadow-none" value={formData.address} onChange={handleChange} placeholder="Địa chỉ giao hàng mặc định..."></textarea>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-100 fw-bold py-2 mt-3 shadow">
                        {loading ? (
                            <span><span className="spinner-border spinner-border-sm me-2"></span>Đang xử lý...</span>
                        ) : "Đăng ký ngay"}
                    </button>

                    <div className="text-center mt-4">
                        <p className="text-secondary small mb-0">Đã có tài khoản?</p>
                        <Link to="/login" className="text-info text-decoration-none small fw-bold">Quay lại đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;