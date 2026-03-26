import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    // Hàm kiểm tra xem menu nào đang active để đổi màu
    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-white border-end shadow-sm" style={{ width: '270px', minHeight: '100vh', zIndex: 100 }}>
            {/* Header Sidebar */}
            <div className="p-4 border-bottom bg-primary text-white text-center shadow-sm">
                <h5 className="fw-bold m-0">
                    <i className="bi bi-speedometer2 me-2"></i>ADMIN PANEL
                </h5>
            </div>

            {/* Menu Items */}
            <div className="nav flex-column p-3 mt-3">
                <Link
                    to="/admin"
                    className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold d-flex align-items-center ${isActive('/admin') ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                >
                    <i className="bi bi-box-seam-fill me-3"></i> Kho hàng
                </Link>

                <Link
                    to="/admin/categories"
                    className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold d-flex align-items-center ${isActive('/admin/categories') ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                >
                    <i className="bi bi-tags-fill me-3"></i> Danh mục
                </Link>

                {/* Mục Đơn hàng - Đã kích hoạt */}
                <Link
                    to="/admin/orders"
                    className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold d-flex align-items-center ${isActive('/admin/orders') ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                >
                    <i className="bi bi-cart-fill me-3"></i> Đơn hàng
                </Link>

                {/* Bạn có thể thêm mục Quản lý người dùng ở đây nếu muốn */}
                <Link
                    to="/admin/users"
                    className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold d-flex align-items-center ${isActive('/admin/users') ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                >
                    <i className="bi bi-people-fill me-3"></i> Người dùng
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;