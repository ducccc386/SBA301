import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="bg-white border-end shadow-sm" style={{ width: '270px', zIndex: 100 }}>
            <div className="p-4 border-bottom bg-primary text-white text-center shadow-sm">
                <h5 className="fw-bold m-0"><i className="bi bi-speedometer2 me-2"></i>ADMIN PANEL</h5>
            </div>
            <div className="nav flex-column p-3 mt-3">
                <Link to="/admin"
                    className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold ${isActive('/admin') ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                    style={{ textDecoration: 'none' }}>
                    <i className="bi bi-box-seam-fill me-3"></i> Kho hàng
                </Link>

                {/* Link mới cho Quản lý danh mục */}
                <Link to="/admin/categories"
                    className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold ${isActive('/admin/categories') ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                    style={{ textDecoration: 'none' }}>
                    <i className="bi bi-tags-fill me-3"></i> Danh mục
                </Link>

                <button className="nav-link text-start py-3 px-4 text-secondary border-0 bg-transparent fw-bold opacity-50" disabled>
                    <i className="bi bi-cart-fill me-3"></i> Đơn hàng
                </button>
            </div>
        </div>
    );
};

export default Sidebar;