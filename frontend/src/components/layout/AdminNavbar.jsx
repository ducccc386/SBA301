import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminNavbar = ({ adminName = "Quản trị viên" }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Lấy tên hiển thị: Ưu tiên tên từ Context
    const displayName = user?.username || adminName;

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 py-2 shadow-sm border-bottom">
            {/* Sử dụng justify-content-end để đẩy tất cả nội dung sang bên phải */}
            <div className="container-fluid justify-content-end">

                {/* Phần bên phải: Thông tin Admin & Nút Đăng xuất */}
                <div className="d-flex align-items-center">
                    {/* User Info */}
                    <div className="d-flex align-items-center me-4 border-end pe-4">
                        <div className="text-end me-3 d-none d-sm-block">
                            <p className="m-0 fw-bold small text-dark">{displayName}</p>
                            <small className="text-success fw-bold" style={{ fontSize: '0.65rem' }}>
                                <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                                Đang hoạt động
                            </small>
                        </div>
                        <img
                            src={`https://ui-avatars.com/api/?name=${displayName}&background=0D6EFD&color=fff`}
                            alt="Avatar"
                            width="38"
                            height="38"
                            className="rounded-circle shadow-sm border"
                        />
                    </div>

                    {/* NÚT ĐĂNG XUẤT */}
                    <button
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold d-flex align-items-center shadow-sm"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Đăng xuất
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;