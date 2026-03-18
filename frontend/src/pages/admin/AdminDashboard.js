import React, { useEffect, useState } from 'react';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import ProductForm from './ProductForm';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
    const [currentTab, setCurrentTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [resPro, resCat] = await Promise.all([productApi.getAll(), categoryApi.getAll()]);
            setProducts(resPro.data);
            setCategories(resCat.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };

    const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0);
    const lowStockCount = products.filter(p => (p.quantity || 0) < 10).length;

    const chartData = {
        labels: categories.map(c => c.name),
        datasets: [{
            data: categories.map(c => products.filter(p => p.category?.id === c.id).length),
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
            borderWidth: 0,
        }]
    };

    const handleSaveProduct = async (dataToSave) => {
        try {
            if (selectedProduct) {
                await productApi.update(selectedProduct.id, dataToSave);
            } else {
                await productApi.create(dataToSave);
            }
            await loadData();
            setShowForm(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Lỗi API:", error);
            alert("Lưu thất bại!");
        }
    };
    const userName = localStorage.getItem('username') || "Quản trị viên";
    return (
        <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fc' }}>
            <div className="bg-white border-end shadow-sm" style={{ width: '270px', zIndex: 100 }}>
                <div className="p-4 border-bottom bg-primary text-white text-center shadow-sm">
                    <h5 className="fw-bold m-0"><i className="bi bi-speedometer2 me-2"></i>ADMIN PANEL</h5>
                </div>
                <div className="nav flex-column p-3 mt-3">
                    <button className={`nav-link text-start py-3 px-4 rounded-3 mb-2 border-0 fw-bold ${currentTab === 'products' ? 'bg-primary text-white shadow' : 'text-secondary bg-transparent'}`}
                        onClick={() => setCurrentTab('products')}>
                        <i className="bi bi-box-seam-fill me-3"></i> Kho hàng
                    </button>
                    <button className="nav-link text-start py-3 px-4 text-secondary border-0 bg-transparent fw-bold opacity-50">
                        <i className="bi bi-cart-fill me-3"></i> Đơn hàng
                    </button>
                </div>
            </div>

            <div className="flex-grow-1 d-flex flex-column">
                <AdminNavbar adminName={userName} />
                <div className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold text-dark">DANH SÁCH SẢN PHẨM</h3>
                        <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm"
                            onClick={() => { setSelectedProduct(null); setShowForm(true); }}>
                            + Thêm sản phẩm
                        </button>
                    </div>

                    <div className="row g-4 mb-4 text-white">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 bg-dark rounded-4 border-start border-5 border-primary">
                                <small className="text-muted fw-bold text-uppercase">TỔNG LOẠI HÀNG</small>
                                <h2 className="fw-bold m-0">{products.length}</h2>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 bg-dark rounded-4 border-start border-5 border-success">
                                <small className="text-muted fw-bold text-uppercase">GIÁ TRỊ KHO</small>
                                <h2 className="fw-bold m-0 text-success">{totalValue.toLocaleString('vi-VN')} đ</h2>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-4 bg-dark rounded-4 border-start border-5 border-warning">
                                <small className="text-muted fw-bold text-uppercase">SẮP HẾT HÀNG</small>
                                <h2 className="fw-bold m-0 text-danger">{lowStockCount} sản phẩm</h2>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4 bg-dark text-white rounded-4 h-100">
                                <h6 className="fw-bold mb-4 text-center border-bottom pb-2">Phân bổ danh mục</h6>
                                <Pie data={chartData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }} />
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm bg-dark text-white rounded-4 overflow-hidden">
                                <table className="table table-dark table-hover align-middle m-0">
                                    <thead className="bg-secondary">
                                        <tr className="small text-uppercase fw-bold">
                                            <th className="ps-4 py-3">Ảnh</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Giá</th>
                                            <th>Kho</th>
                                            <th>Trạng thái</th>
                                            <th className="text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(p => (
                                            <tr key={p.id}>
                                                <td className="ps-4"><img src={p.imageUrl} width="40" height="40" className="rounded border border-secondary" alt="" /></td>
                                                <td className="fw-bold">{p.name}</td>
                                                <td className="text-info">{p.price?.toLocaleString('vi-VN')} đ</td>

                                                {/* CẢNH BÁO KHO: Nếu < 10 thì hiện màu đỏ đỏ chói */}
                                                <td className={`fw-bold ${p.quantity < 10 ? 'text-danger' : ''}`}>
                                                    {p.quantity} {p.quantity < 10 && <i className="bi bi-exclamation-triangle-fill ms-1"></i>}
                                                </td>

                                                {/* TRẠNG THÁI: Active xanh, Inactive đỏ */}
                                                <td>
                                                    <span className={`badge rounded-pill ${p.status === 'Inactive'
                                                        ? 'bg-danger text-white'
                                                        : 'bg-success text-white'
                                                        }`} style={{ padding: '6px 12px' }}>
                                                        {p.status || 'Active'}
                                                    </span>
                                                </td>

                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-warning me-2" onClick={() => { setSelectedProduct(p); setShowForm(true); }}>Sửa</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => productApi.delete(p.id).then(loadData)}>Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showForm && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden bg-dark text-white">
                            <ProductForm
                                product={selectedProduct}
                                onSave={handleSaveProduct}
                                onCancel={() => { setShowForm(false); setSelectedProduct(null); }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;