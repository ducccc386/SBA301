import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar';
import reviewApi from '../../api/reviewApi';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchReviews = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const response = await reviewApi.getAll({
                search: search,
                page: page,
                size: 8
            });
            // Bóc tách data từ response.data của axiosClient
            const data = response.data;
            if (data) {
                setReviews(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) {
            toast.error("Không thể tải danh sách đánh giá");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => fetchReviews(currentPage, searchTerm), 500);
        return () => clearTimeout(delay);
    }, [currentPage, searchTerm, fetchReviews]);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
            try {
                await reviewApi.delete(id);
                toast.success("Xóa đánh giá thành công");
                fetchReviews(currentPage, searchTerm);
            } catch (error) {
                toast.error("Lỗi khi xóa đánh giá");
            }
        }
    };

    // Hàm hiển thị sao đánh giá
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <i key={i} className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary'} me-1`}></i>
        ));
    };

    return (
        <div className="d-flex" style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#fff' }}>
            <Sidebar />
            <div className="flex-grow-1">
                <AdminNavbar />

                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold">Quản lý Đánh giá</h3>
                        <div className="w-25">
                            <input
                                type="text" className="form-control bg-dark border-secondary text-white shadow-none"
                                placeholder="Tìm theo tên hoặc nội dung..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                            />
                        </div>
                    </div>

                    <div className="card bg-dark border-secondary shadow-sm rounded-4 overflow-hidden">
                        <table className="table table-dark table-hover align-middle mb-0 text-center">
                            <thead className="text-secondary border-secondary">
                                <tr>
                                    <th className="py-3">Người dùng</th>
                                    <th>Mã SP</th>
                                    <th>Mức độ</th>
                                    <th>Nội dung</th>
                                    <th>Ngày gửi</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="py-5 text-muted">Đang tải...</td></tr>
                                ) : reviews.length === 0 ? (
                                    <tr><td colSpan="6" className="py-5 text-muted">Chưa có đánh giá nào.</td></tr>
                                ) : (
                                    reviews.map(rev => (
                                        <tr key={rev.id} className="border-secondary">
                                            <td className="text-start ps-4">
                                                <div className="fw-bold text-info">{rev.user?.username || 'N/A'}</div>
                                                <small className="text-muted">{rev.user?.email}</small>
                                            </td>
                                            <td>#{rev.productId}</td>
                                            <td>{renderStars(rev.rating)}</td>
                                            <td className="text-start" style={{ maxWidth: '250px' }}>
                                                <div className="text-truncate" title={rev.comment}>{rev.comment}</div>
                                            </td>
                                            <td>{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : '---'}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(rev.id)}>
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <nav>
                                <ul className="pagination pagination-sm">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                            <button className="page-link bg-dark border-secondary text-white shadow-none mx-1 rounded" onClick={() => setCurrentPage(i)}>
                                                {i + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewManagement;