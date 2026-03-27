import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // THÊM DÒNG NÀY

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const { user, logout } = useAuth();
    const { cartItems } = useCart(); // LẤY DANH SÁCH GIỎ HÀNG
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            logout();
            navigate('/login');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 sticky-top shadow">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">My-Eshop</Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Cửa hàng</Link></li>
                        {/* Kiểm tra cả 'ADMIN' hoặc 'ROLE_ADMIN' tùy theo backend của bạn */}
                        {user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN') && (
                            <li className="nav-item"><Link className="nav-link" to="/admin">Quản trị</Link></li>
                        )}
                    </ul>

                    {/* THANH TÌM KIẾM - GIỮ NGUYÊN LOGIC */}
                    <form className="d-flex w-50" onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="form-control me-2 rounded-pill bg-dark text-white border-secondary shadow-none"
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <div className="navbar-nav ms-3 align-items-center">
                        {/* ICON GIỎ HÀNG - SỬ DỤNG BOOTSTRAP CLASS ĐỂ TRÁNH LỖI MODULE */}
                        <Link to="/cart" className="nav-link position-relative me-3 text-white">
                            <i className="bi bi-cart3 fs-5"></i> {/* Icon giỏ hàng */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                            </svg>
                            {cartItems.length > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.7rem' }}>
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP
                            <div className="d-flex align-items-center">
                                <span className="text-light me-3 small">Chào, <strong>{user.username}</strong></span>
                                <button
                                    className="btn btn-outline-danger btn-sm rounded-pill px-3"
                                    onClick={handleLogoutClick}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            // HIỂN THỊ KHI CHƯA ĐĂNG NHẬP
                            <Link className="btn btn-primary btn-sm rounded-pill px-4" to="/login">Đăng nhập</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;