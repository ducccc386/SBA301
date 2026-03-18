import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ searchTerm, setSearchTerm }) => {
    const { user, logout } = useAuth(); // Lấy thông tin user và hàm logout
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            logout(); // Hàm này bạn đã sửa trong AuthContext để xóa localStorage
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
                        {/* Chỉ hiện link Quản trị nếu user là ADMIN */}
                        {user && user.role === 'ADMIN' && (
                            <li className="nav-item"><Link className="nav-link" to="/admin">Quản trị</Link></li>
                        )}
                    </ul>

                    {/* THANH TÌM KIẾM */}
                    <form className="d-flex w-50">
                        <input
                            className="form-control me-2 rounded-pill"
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </form>

                    <div className="navbar-nav ms-3 align-items-center">
                        {user ? (
                            // HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP
                            <div className="d-flex align-items-center">
                                <span className="text-light me-3">Chào, <strong>{user.username}</strong></span>
                                <button
                                    className="btn btn-outline-danger btn-sm rounded-pill"
                                    onClick={handleLogoutClick}
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            // HIỂN THỊ KHI CHƯA ĐĂNG NHẬP
                            <Link className="nav-link" to="/login">Đăng nhập</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;