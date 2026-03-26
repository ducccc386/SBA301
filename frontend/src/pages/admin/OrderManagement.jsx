import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminOrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState(null); // Để làm chức năng "Read" (Xem chi tiết)
    const itemsPerPage = 5;

    // 1. Lấy dữ liệu
    const fetchOrders = async () => {
        const res = await axios.get('/api/admin/orders');
        setOrders(res.data);
    };

    useEffect(() => { fetchOrders(); }, []);

    // 2. Logic Tìm kiếm & Phân trang
    const filteredOrders = orders.filter(o =>
        o.receiver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.toString() === searchTerm
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const currentItems = filteredOrders.slice(indexOfLastItem - itemsPerPage, indexOfLastItem);

    // 3. Update Status (Validate: Không cho chuyển ngược trạng thái đã hoàn thành)
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
            toast.success("Cập nhật trạng thái thành công!");
            fetchOrders();
        } catch (err) {
            toast.error("Lỗi cập nhật!");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-vh-100">
            {/* Header & Search */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold text-primary">Quản Lý Đơn Hàng</h2>
                <div className="input-group w-25 shadow-sm">
                    <span className="input-group-text bg-white border-end-0"><i className="bi bi-search"></i></span>
                    <input
                        type="text" className="form-control border-start-0"
                        placeholder="Tìm mã đơn, tên khách..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0 rounded-3">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Khách Hàng</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Ngày Đặt</th>
                            <th>Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(order => (
                            <tr key={order.id}>
                                <td className="fw-bold">#{order.id}</td>
                                <td>
                                    <div>{order.receiver_name}</div>
                                    <small className="text-muted">{order.receiver_phone}</small>
                                </td>
                                <td className="text-danger fw-bold">{order.total_price.toLocaleString()}đ</td>
                                <td>
                                    <select
                                        className={`form-select form-select-sm badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    >
                                        <option value="Pending">Chờ xử lý</option>
                                        <option value="Shipping">Đang giao</option>
                                        <option value="Completed">Hoàn thành</option>
                                        <option value="Cancelled">Đã hủy</option>
                                    </select>
                                </td>
                                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-outline-primary"
                                        data-bs-toggle="modal" data-bs-target="#orderDetailModal"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <i className="bi bi-eye"></i> Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="mt-3 d-flex justify-content-center">
                <button className="btn btn-sm btn-light mx-1" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>Trước</button>
                <span className="p-2">Trang {currentPage}</span>
                <button className="btn btn-sm btn-light mx-1" onClick={() => setCurrentPage(p => p + 1)}>Sau</button>
            </div>

            {/* Modal "Read" - Xem chi tiết đơn hàng */}
            {selectedOrder && (
                <div className="modal fade" id="orderDetailModal" tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi tiết đơn hàng #{selectedOrder.id}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Địa chỉ giao:</strong> {selectedOrder.shipping_address}</p>
                                <p><strong>Ghi chú:</strong> {selectedOrder.order_note}</p>
                                <hr />
                                <h6>Sản phẩm đã mua:</h6>
                                {/* Lặp qua selectedOrder.orderDetails để hiện list sản phẩm */}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};