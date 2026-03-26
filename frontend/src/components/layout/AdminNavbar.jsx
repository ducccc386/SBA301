import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ adminName = "Quản trị viên" }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa token và đẩy về trang login
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white px-4 py-2 shadow-sm border-bottom">
            <div className="container-fluid">
                {/* Thanh tìm kiếm nhanh bên trái */}
                <form className="d-none d-md-flex me-auto">
                    <div className="input-group">
                        <span className="input-group-text bg-light border-0">
                            <i className="bi bi-search text-muted"></i>
                        </span>
                        <input
                            className="form-control bg-light border-0 ps-0"
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            style={{ fontSize: '0.85rem', width: '200px' }}
                        />
                    </div>
                </form>

                {/* Phần bên phải: Thông tin Admin & Nút Đăng xuất */}
                <div className="d-flex align-items-center">
                    {/* User Info */}
                    <div className="d-flex align-items-center me-4 border-end pe-4">
                        <div className="text-end me-3 d-none d-sm-block">
                            <p className="m-0 fw-bold small text-dark">{adminName}</p>
                            <small className="text-success fw-bold" style={{ fontSize: '0.65rem' }}>
                                <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
                                Đang hoạt động
                            </small>
                        </div>
                        <img
                            src={`https://ui-avatars.com/api/?name=${adminName}&background=0D6EFD&color=fff`}
                            alt="Avatar"
                            width="38"
                            height="38"
                            className="rounded-circle shadow-sm border"
                        />
                    </div>

                    {/* NÚT ĐĂNG XUẤT (Lộ diện hoàn toàn) */}
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