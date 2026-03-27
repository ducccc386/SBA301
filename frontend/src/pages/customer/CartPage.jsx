import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
    // Lấy đầy đủ các hàm từ Context
    const { cartItems, addToCart, decreaseQty, removeFromCart, getCartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    // Logic tăng số lượng
    const handleIncrease = (item) => {
        addToCart(item);
    };

    // Logic giảm số lượng (Đã sửa lỗi)
    const handleDecrease = (item) => {
        if (item.qty > 1) {
            decreaseQty(item.id);
        } else {
            // Nếu bằng 1 mà bấm giảm thì hỏi có muốn xóa không
            if (window.confirm(`Bạn có muốn xóa sản phẩm ${item.name} khỏi giỏ hàng?`)) {
                removeFromCart(item.id);
            }
        }
    };

    // Giao diện khi giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="container mt-5 text-center py-5" style={{ color: 'white', backgroundColor: '#1a1a1a', borderRadius: '15px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-cart-x text-secondary mb-3" viewBox="0 0 16 16">
                    <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793z" />
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                </svg>
                <h3 className="fw-bold">Giỏ hàng của bạn đang trống</h3>
                <p className="text-secondary">Hãy chọn cho mình những sản phẩm ưng ý nhất nhé!</p>
                <Link to="/" className="btn btn-primary rounded-pill px-4 mt-3 fw-bold shadow">Tiếp tục mua sắm</Link>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ color: 'white' }}>
            <h3 className="fw-bold mb-4">Giỏ hàng của bạn ({cartItems.length})</h3>

            <div className="row">
                {/* DANH SÁCH SẢN PHẨM */}
                <div className="col-lg-8">
                    <div className="card bg-dark border-secondary shadow-sm mb-4">
                        <div className="table-responsive">
                            <table className="table table-dark table-hover mb-0 border-secondary">
                                <thead className="text-secondary small uppercase">
                                    <tr>
                                        <th className="ps-4">Sản phẩm</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-end">Đơn giá</th>
                                        <th className="text-center">Xóa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map(item => (
                                        <tr key={item.id} className="align-middle border-secondary">
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center py-2">
                                                    <img
                                                        src={item.imageUrl || 'https://via.placeholder.com/50'}
                                                        alt={item.name}
                                                        className="rounded bg-white p-1 shadow-sm"
                                                        style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                                    />
                                                    <div className="ms-3">
                                                        <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>{item.name}</div>
                                                        <div className="small text-secondary">Mã SP: #{item.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-inline-flex align-items-center bg-black rounded-pill border border-secondary px-2 py-1">
                                                    {/* Nút Giảm */}
                                                    <button className="btn btn-sm text-white border-0 shadow-none px-2" onClick={() => handleDecrease(item)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" /></svg>
                                                    </button>

                                                    <span className="px-2 fw-bold" style={{ minWidth: '20px' }}>{item.qty}</span>

                                                    {/* Nút Tăng */}
                                                    <button className="btn btn-sm text-white border-0 shadow-none px-2" onClick={() => handleIncrease(item)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="text-end fw-bold text-danger">
                                                {(item.price * item.qty).toLocaleString()} đ
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-outline-danger btn-sm border-0 rounded-circle" onClick={() => removeFromCart(item.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" /><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button className="btn btn-link text-secondary text-decoration-none p-0 mb-3 small" onClick={() => { if (window.confirm("Xóa toàn bộ giỏ hàng?")) clearCart() }}>
                        Làm trống giỏ hàng
                    </button>
                </div>

                {/* TÓM TẮT ĐƠN HÀNG */}
                <div className="col-lg-4">
                    <div className="card bg-dark border-secondary shadow p-4 rounded-4 sticky-top" style={{ top: '100px', zIndex: '10' }}>
                        <h5 className="fw-bold mb-4 text-info text-center">Tóm tắt đơn hàng</h5>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-secondary">Tạm tính:</span>
                            <span className="fw-bold">{getCartTotal().toLocaleString()} đ</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <span className="text-secondary">Phí vận chuyển:</span>
                            <span className="text-success small fw-bold">Miễn phí</span>
                        </div>
                        <hr className="border-secondary" />
                        <div className="d-flex justify-content-between mb-4 mt-2">
                            <span className="fw-bold fs-5">Tổng cộng:</span>
                            <span className="fw-bold fs-4 text-danger">{getCartTotal().toLocaleString()} đ</span>
                        </div>

                        {/* Nút Thanh Toán (Quan trọng nhất) */}
                        <button
                            className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm transition-all"
                            onClick={() => navigate('/checkout')}
                            style={{ fontSize: '1.1rem' }}
                        >
                            TIẾN HÀNH THANH TOÁN
                        </button>

                        <div className="mt-4 text-center">
                            <Link to="/" className="text-info text-decoration-none small d-flex align-items-center justify-content-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" /></svg>
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;