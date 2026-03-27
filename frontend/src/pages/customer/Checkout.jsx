import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Khởi tạo thông tin người nhận
    const [orderInfo, setOrderInfo] = useState({
        receiverName: user?.username || "", // Thêm tên người nhận
        receiverPhone: user?.phone || "",
        shippingAddress: user?.address || "",
        orderNote: ""
    });

    // Tự động bảo vệ route nếu user chưa login hoặc giỏ hàng trống
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (cartItems.length === 0) {
            navigate('/');
        }
    }, [user, cartItems, navigate]);

    const handleInputChange = (e) => {
        setOrderInfo({ ...orderInfo, [e.target.name]: e.target.value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        // Kiểm tra validation cơ bản
        if (!orderInfo.receiverPhone || !orderInfo.shippingAddress) {
            toast.error("Vui lòng nhập đầy đủ số điện thoại và địa chỉ nhận hàng!");
            return;
        }

        setLoading(true);

        // Payload đã được sửa lại Key để khớp với Entity Backend
        const payload = {
            userId: user.id,
            totalPrice: getCartTotal(),
            status: "PENDING",
            paymentMethod: "COD",

            // Các trường thông tin giao hàng khớp với Database của bạn
            receiverName: orderInfo.receiverName,
            receiverPhone: orderInfo.receiverPhone,
            shippingAddress: orderInfo.shippingAddress,
            orderNote: orderInfo.orderNote,

            // Danh sách sản phẩm
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.qty,
                price: item.price
            }))
        };

        try {
            // Gọi API lưu vào DB
            await axiosClient.post("/orders", payload);

            toast.success("🎉 Đặt hàng thành công! Đơn hàng đang chờ xử lý.");
            clearCart();

            // Chờ một chút để user thấy thông báo thành công rồi mới về trang chủ
            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            console.error("Lỗi đặt hàng:", err);
            toast.error(err.response?.data?.message || "Lỗi khi đặt hàng, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4 text-white pb-5">
            <h3 className="fw-bold mb-4">Thanh toán đơn hàng</h3>
            <div className="row g-4">
                <div className="col-md-7">
                    <div className="card bg-dark border-secondary p-4 shadow">
                        <h5 className="mb-4 text-info">Thông tin giao hàng</h5>
                        <form onSubmit={handleSubmitOrder}>
                            <div className="mb-3">
                                <label className="form-label small text-secondary">Họ tên người nhận</label>
                                <input
                                    type="text"
                                    name="receiverName"
                                    className="form-control bg-black text-white border-secondary"
                                    value={orderInfo.receiverName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-secondary">Số điện thoại</label>
                                <input
                                    type="text"
                                    name="receiverPhone"
                                    className="form-control bg-black text-white border-secondary"
                                    value={orderInfo.receiverPhone}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số điện thoại..."
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-secondary">Địa chỉ nhận hàng</label>
                                <textarea
                                    name="shippingAddress"
                                    className="form-control bg-black text-white border-secondary"
                                    rows="3"
                                    value={orderInfo.shippingAddress}
                                    onChange={handleInputChange}
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small text-secondary">Ghi chú (tùy chọn)</label>
                                <input
                                    type="text"
                                    name="orderNote"
                                    className="form-control bg-black text-white border-secondary"
                                    value={orderInfo.orderNote}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card bg-dark border-secondary p-4 shadow">
                        <h5 className="mb-3 text-info">Tóm tắt đơn hàng</h5>
                        <div className="mb-3 overflow-auto" style={{ maxHeight: '300px' }}>
                            {cartItems.map(item => (
                                <div key={item.id} className="d-flex justify-content-between mb-3 border-bottom border-secondary pb-2 small">
                                    <span>{item.name} <b className="text-secondary">x{item.qty}</b></span>
                                    <span>{(item.price * item.qty).toLocaleString()} đ</span>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-between fw-bold fs-5 text-danger mb-4 mt-2">
                            <span>Tổng cộng:</span>
                            <span>{getCartTotal().toLocaleString()} đ</span>
                        </div>
                        <button
                            className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow"
                            onClick={handleSubmitOrder}
                            disabled={loading}
                        >
                            {loading ? (
                                <span><span className="spinner-border spinner-border-sm me-2"></span> ĐANG XỬ LÝ...</span>
                            ) : "XÁC NHẬN ĐẶT HÀNG"}
                        </button>
                        <p className="text-center small text-secondary mt-3 mb-0">
                            Phương thức: Thanh toán khi nhận hàng (COD)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;