import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import Sidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar'; // Giữ Navbar của bạn
import userApi from '../../api/userApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchUsers = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const response = await userApi.getAllUsers({ search, page, size: 8 });
            const data = response.data;
            if (data) {
                setUsers(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) {
            toast.error("Lỗi tải danh sách người dùng");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => fetchUsers(currentPage, searchTerm), 500);
        return () => clearTimeout(delay);
    }, [currentPage, searchTerm, fetchUsers]);

    return (
        <div className="d-flex" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
            <Sidebar />
            <div className="flex-grow-1">
                <AdminNavbar /> {/* Thanh Navbar nằm trên cùng */}

                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold text-dark">Quản lý Người dùng</h3>
                        <div className="position-relative w-25">
                            <input
                                type="text" className="form-control shadow-sm ps-4"
                                placeholder="Tìm kiếm người dùng..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                            />
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"></i>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <table className="table table-hover align-middle mb-0 text-center">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3 border-0">ID</th>
                                    <th className="border-0">Người dùng</th>
                                    <th className="border-0">Vai trò</th>
                                    <th className="border-0">Ngày tạo</th>
                                    <th className="border-0">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="py-5">Đang tải dữ liệu...</td></tr>
                                ) : users.map(user => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td className="text-start">
                                            <div className="fw-bold">{user.username}</div>
                                            <small className="text-muted">{user.email}</small>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'} rounded-pill`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}</td>
                                        <td>
                                            <button className="btn btn-sm btn-info text-white me-2" onClick={() => { setSelectedUser(user); setShowModal(true); }}>
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination pagination-sm">
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                        <button className="page-link shadow-none" onClick={() => setCurrentPage(i)}>{i + 1}</button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Modal Chi tiết */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Chi tiết người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedUser && (
                        <div className="row g-3">
                            <div className="col-6 text-muted">Tên đăng nhập:</div><div className="col-6 fw-bold">{selectedUser.username}</div>
                            <div className="col-6 text-muted">Email:</div><div className="col-6 fw-bold">{selectedUser.email}</div>
                            <div className="col-6 text-muted">Số điện thoại:</div><div className="col-6 fw-bold">{selectedUser.phone || 'Chưa có'}</div>
                            <div className="col-6 text-muted">Địa chỉ:</div><div className="col-6 fw-bold small">{selectedUser.address || 'Chưa có'}</div>
                            <div className="col-6 text-muted">Vai trò:</div><div className="col-6"><span className="badge bg-info">{selectedUser.role}</span></div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default UserManagement;