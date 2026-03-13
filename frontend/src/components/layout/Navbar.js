import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ searchTerm, setSearchTerm }) => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 sticky-top shadow">
        <div className="container">
            <Link className="navbar-brand fw-bold" to="/">My-Eshop</Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item"><Link className="nav-link" to="/">Cửa hàng</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/admin">Quản trị</Link></li>
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

                <div className="navbar-nav ms-3">
                    <Link className="nav-link" to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    </nav>
);

export default Navbar;