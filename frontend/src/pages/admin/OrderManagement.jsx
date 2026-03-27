import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import Sidebar from '../../components/layout/AdminSidebar';
import AdminNavbar from '../../components/layout/AdminNavbar'; // Giữ Navbar của bạn
import orderApi from '../../api/orderApi';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchOrders = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const response = await orderApi.getAllOrders({ search, page, size: 8 });
            const data = response.data;
            if (data) {
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
            }
        } catch (error) {
            toast.error("Lỗi tải đơn hàng");
        } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => fetchOrders(currentPage, searchTerm), 500);
        return () => clearTimeout(delay);
    }, [currentPage, searchTerm, fetchOrders]);

    const handleStatusUpdate = async (id, status) => {
        try {
            await orderApi.updateStatus(id, status);
            toast.success("Cập nhật trạng thái thành công");
            fetchOrders(currentPage, searchTerm);
        } catch (error) { toast.error("Không thể cập nhật trạng thái"); }
    };

    return (
        <div className="d-flex" style={{ backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
            <Sidebar />
            <div className="flex-grow-1">
                <AdminNavbar />

                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold text-dark">Quản lý Đơn hàng</h3>
                        <input
                            type="text" className="form-control w-25 shadow-sm"
                            placeholder="Tìm tên người nhận..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(0); }}
                        />
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <table className="table table-hover align-middle mb-0 text-center">
                            <thead className="bg-light">
                                <tr>
                                    <th className="py-3">Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Tổng tiền</th>
                                    <th>Trạng thái</th>
                                    <th>Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="5" className="py-5">Đang tải đơn hàng...</td></tr>
                                ) : orders.map(order => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td className="fw-bold text-primary">{order.receiverName}</td>
                                        <td className="text-danger fw-bold">{order.totalPrice?.toLocaleString()}đ</td>
                                        <td>
                                            <select
                                                className={`form-select form-select-sm border-0 shadow-sm rounded-pill ${order.status === 'CANCELLED' ? 'text-danger' : 'text-success'}`}
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                            >
                                                <option value="PENDING">Chờ xử lý</option>
                                                <option value="SHIPPING">Đang giao</option>
                                                <option value="COMPLETED">Hoàn thành</option>
                                                <option value="CANCELLED">Hủy đơn</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary shadow-sm" onClick={() => { setSelectedOrder(order); setShowModal(true); }}>
                                                Xem chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Phân trang */}
                    <div className="d-flex justify-content-center mt-4">
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} className={`btn btn-sm mx-1 shadow-sm ${currentPage === i ? 'btn-primary' : 'btn-white'}`} onClick={() => setCurrentPage(i)}>{i + 1}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal Chi tiết Đơn hàng */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton><Modal.Title>Đơn hàng #{selectedOrder?.id}</Modal.Title></Modal.Header>
                <Modal.Body>
                    {selectedOrder && (
                        <div className="row">
                            <div className="col-md-6 border-end">
                                <h6 className="fw-bold mb-3">Người nhận hàng</h6>
                                <p><strong>Tên:</strong> {selectedOrder.receiverName}</p>
                                <p><strong>SĐT:</strong> {selectedOrder.receiverPhone}</p>
                                <p><strong>Địa chỉ:</strong> {selectedOrder.shippingAddress}</p>
                                <p><strong>Ghi chú:</strong> {selectedOrder.orderNote || 'Không có'}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="fw-bold mb-3">Sản phẩm đã đặt</h6>
                                {selectedOrder.orderDetails?.map((item, idx) => (
                                    <div key={idx} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                        <span>{item.product?.name} <small className="text-muted">x{item.quantity}</small></span>
                                        <span className="fw-bold">{item.price?.toLocaleString()}đ</span>
                                    </div>
                                ))}
                                <div className="text-end mt-3"><h5 className="text-danger fw-bold">Tổng: {selectedOrder.totalPrice?.toLocaleString()}đ</h5></div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};
export default OrderManagement;