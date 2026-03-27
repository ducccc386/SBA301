import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import Sidebar from '../../components/layout/AdminSidebar';
import orderApi from '../../api/orderApi';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Hàm lấy dữ liệu từ API
    const fetchOrders = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const response = await orderApi.getAllOrders({
                search: search,
                page: page,
                size: 8
            });

            // VÌ BẠN ĐÃ ĐỔI AXIOS_CLIENT SANG "KHÔNG GỌT VỎ":
            // Dữ liệu thực tế từ Server (Preview trong ảnh) sẽ nằm ở response.data
            const data = response.data;

            if (data) {
                // Lấy mảng đơn hàng từ trường 'content'
                setOrders(data.content || []);
                // Lấy tổng số trang từ trường 'totalPages'
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Không thể kết nối đến máy chủ");
            setOrders([]); // Đảm bảo không bị undefined để tránh lỗi filter
        } finally {
            setLoading(false);
        }
    }, []);

    // Xử lý "Vừa gõ vừa load" (Debounce 500ms) - GIỮ NGUYÊN
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchOrders(currentPage, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, searchTerm, fetchOrders]);

    // Cập nhật trạng thái đơn hàng - GIỮ NGUYÊN
    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await orderApi.updateStatus(id, newStatus);
            toast.success("Cập nhật trạng thái thành công");
            fetchOrders(currentPage, searchTerm);
        } catch (error) {
            toast.error("Lỗi khi cập nhật trạng thái");
        }
    };

    const openDetailModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    return (
        <div className="d-flex" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Sidebar />

            <div className="flex-grow-1 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold">Quản lý Đơn hàng</h3>
                    <div className="w-50">
                        <div className="input-group shadow-sm border rounded-3 overflow-hidden">
                            <span className="input-group-text bg-white border-0">
                                <i className="bi bi-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-0 shadow-none"
                                placeholder="Tìm theo tên khách hoặc số điện thoại..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(0); // Reset về trang đầu khi tìm kiếm
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <table className="table table-hover align-middle mb-0 text-center">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th className="py-3">ID</th>
                                <th>Khách hàng</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="py-5 text-muted">Đang tải dữ liệu...</td></tr>
                            ) : (orders || []).length === 0 ? (
                                <tr><td colSpan="6" className="py-5 text-muted">Không tìm thấy đơn hàng nào.</td></tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id}>
                                        <td className="fw-bold text-secondary">#{order.id}</td>
                                        <td className="text-start ps-4">
                                            <div className="fw-bold">{order.receiverName}</div>
                                            <small className="text-muted">{order.receiverPhone}</small>
                                        </td>
                                        <td className="text-danger fw-bold">{order.totalPrice?.toLocaleString()} đ</td>
                                        <td>
                                            <select
                                                className={`form-select form-select-sm fw-bold w-75 mx-auto ${order.status === 'CANCELLED' ? 'text-danger border-danger' : 'text-primary border-primary'
                                                    }`}
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                            >
                                                <option value="PENDING">Chờ xử lý</option>
                                                <option value="SHIPPING">Đang giao</option>
                                                <option value="COMPLETED">Hoàn thành</option>
                                                <option value="CANCELLED">Đã hủy</option>
                                            </select>
                                        </td>
                                        <td className="small text-muted">
                                            {order.orderDate ? new Date(order.orderDate).toLocaleDateString('vi-VN') : 'N/A'}
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary rounded-pill px-3" onClick={() => openDetailModal(order)}>
                                                Chi tiết
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
                            <ul className="pagination">
                                {[...Array(totalPages)].map((_, i) => (
                                    <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                        <button className="page-link shadow-none" onClick={() => setCurrentPage(i)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* Modal Chi tiết đơn hàng - GIỮ NGUYÊN */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fw-bold">Chi tiết đơn hàng #{selectedOrder?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    {selectedOrder && (
                        <div className="row">
                            <div className="col-md-6 border-end">
                                <h6 className="text-primary fw-bold mb-3">Thông tin khách hàng</h6>
                                <p><strong>Họ tên:</strong> {selectedOrder.receiverName}</p>
                                <p><strong>SĐT:</strong> {selectedOrder.receiverPhone}</p>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                                <p><strong>Thanh toán:</strong> {selectedOrder.paymentMethod}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-primary fw-bold mb-3">Sản phẩm</h6>
                                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {selectedOrder.orderDetails && selectedOrder.orderDetails.length > 0 ? (
                                        selectedOrder.orderDetails.map((item, idx) => (
                                            <div key={idx} className="d-flex justify-content-between border-bottom py-2">
                                                <span>{item.product?.name} <small className="text-muted">x{item.quantity}</small></span>
                                                <span className="fw-bold">{item.price?.toLocaleString()}đ</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted italic">Chưa có chi tiết sản phẩm.</p>
                                    )}
                                </div>
                                <div className="mt-3 text-end fw-bold fs-5">
                                    Tổng: <span className="text-danger">{selectedOrder.totalPrice?.toLocaleString()}đ</span>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default OrderList;