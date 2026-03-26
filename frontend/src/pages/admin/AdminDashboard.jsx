import React, { useEffect, useState } from 'react';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import ProductForm from './ProductForm';
import AdminNavbar from '../../components/layout/AdminNavbar';
import Sidebar from '../../components/layout/AdminSidebar';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // --- STATE MỚI CHO TÌM KIẾM & PHÂN TRANG ---
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const [resPro, resCat] = await Promise.all([productApi.getAll(), categoryApi.getAll()]);
            setProducts(resPro.data);
            setCategories(resCat.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            if (error.response?.status === 403) {
                toast.error("🚫 Bạn không có quyền xem trang quản trị!");
            } else {
                toast.error("Lỗi kết nối máy chủ!");
            }
        }
    };

    // --- LOGIC LỌC VÀ PHÂN TRANG ---
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category?.name && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const currentItems = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDeleteProduct = async (productId) => {
        const isConfirmed = window.confirm("⚠️ Bạn có chắc chắn muốn xóa sản phẩm này không?");
        if (isConfirmed) {
            const idToast = toast.loading("Đang xóa...");
            try {
                await productApi.delete(productId);
                await loadData();
                toast.update(idToast, { render: "Đã xóa sản phẩm!", type: "success", isLoading: false, autoClose: 2000 });
            } catch (error) {
                let msg = "Xóa thất bại!";
                if (error.response?.status === 403) msg = "🚫 Lỗi 403: Bạn không có quyền xóa!";
                toast.update(idToast, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
            }
        }
    };

    const handleSaveProduct = async (dataToSave) => {
        const idToast = toast.loading("Đang xử lý...");
        try {
            if (selectedProduct) {
                await productApi.update(selectedProduct.id, dataToSave);
                toast.update(idToast, { render: "Cập nhật thành công! 🎉", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                await productApi.create(dataToSave);
                toast.update(idToast, { render: "Thêm mới thành công! 🚀", type: "success", isLoading: false, autoClose: 2000 });
            }
            await loadData();
            setShowForm(false);
            setSelectedProduct(null);
        } catch (error) {
            let errorMessage = "Có lỗi xảy ra!";
            if (error.response?.status === 403) errorMessage = "🚫 Lỗi 403: Backend từ chối quyền Admin!";
            else if (error.response?.status === 401) errorMessage = "🔑 Phiên đăng nhập hết hạn!";

            toast.update(idToast, { render: errorMessage, type: "error", isLoading: false, autoClose: 4000 });
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

    const userName = localStorage.getItem('username') || "Quản trị viên";

    return (
        <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fc' }}>
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column">
                <AdminNavbar adminName={userName} />
                <div className="p-4">
                    {/* Header với Search */}
                    <div className="d-flex justify-content-between align-items-center mb-4 gap-3">
                        <h3 className="fw-bold text-dark m-0 d-none d-md-block">SẢN PHẨM</h3>
                        <div className="d-flex gap-2 flex-grow-1 justify-content-end">
                            <input
                                type="text"
                                className="form-control rounded-pill border-0 shadow-sm px-4 w-50"
                                placeholder="Tìm theo tên hoặc danh mục..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm"
                                onClick={() => { setSelectedProduct(null); setShowForm(true); }}>
                                + Thêm sản phẩm
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
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
                                            <th className="text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map(p => (
                                            <tr key={p.id}>
                                                <td className="ps-4"><img src={p.imageUrl} width="40" height="40" className="rounded border border-secondary" alt="" /></td>
                                                <td className="fw-bold text-truncate" style={{ maxWidth: '150px' }}>{p.name}</td>
                                                <td className="text-info">{p.price?.toLocaleString('vi-VN')} đ</td>
                                                <td className={`fw-bold ${p.quantity < 10 ? 'text-danger' : ''}`}>
                                                    {p.quantity} {p.quantity < 10 && <i className="bi bi-exclamation-triangle-fill ms-1"></i>}
                                                </td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-warning me-2" onClick={() => { setSelectedProduct(p); setShowForm(true); }}>Sửa</button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id)}>Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* PHÂN TRANG */}
                                <div className="d-flex justify-content-between align-items-center p-3 border-top border-secondary bg-dark">
                                    <small className="text-muted">Trang {currentPage} / {totalPages || 1}</small>
                                    <div className="btn-group">
                                        <button className="btn btn-sm btn-outline-light" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Trước</button>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button key={i} className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-light'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                        ))}
                                        <button className="btn btn-sm btn-outline-light" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(currentPage + 1)}>Sau</button>
                                    </div>
                                </div>
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