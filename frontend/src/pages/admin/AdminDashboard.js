import React, { useEffect, useState } from 'react';
import productApi from '../../api/productApi';
import ProductForm from './ProductForm';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null); // NULL = Thêm mới, có dữ liệu = Đang sửa
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        const res = await productApi.getAll();
        setProducts(res.data);
    };

    const handleSave = async (data) => {
        try {
            if (editingProduct) {
                await productApi.update(editingProduct.id, data);
                alert("Cập nhật thành công!");
            } else {
                await productApi.create(data);
                alert("Thêm mới thành công!");
            }
            setShowForm(false);
            setEditingProduct(null);
            loadProducts(); // Load lại bảng
        } catch (err) { alert("Lỗi khi lưu!"); }
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between mb-4 align-items-center">
                <h3>Quản trị hệ thống</h3>
                {!showForm && (
                    <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingProduct(null); }}>
                        + Thêm sản phẩm
                    </button>
                )}
            </div>

            {/* HIỆN FORM NẾU ĐANG THÊM HOẶC SỬA */}
            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                />
            )}

            <div className="card shadow-sm overflow-hidden">
                <table className="table table-hover m-0">
                    <thead className="table-dark">
                        <tr>
                            <th>Ảnh</th><th>Tên</th><th>Giá</th><th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td><img src={p.imageUrl} width="40" alt="" /></td>
                                <td>{p.name}</td>
                                <td className="text-danger fw-bold">{p.price?.toLocaleString()} đ</td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2"
                                        onClick={() => { setEditingProduct(p); setShowForm(true); }}>Sửa</button>
                                    <button className="btn btn-danger btn-sm"
                                        onClick={async () => { if (window.confirm("Xóa?")) { await productApi.delete(p.id); loadProducts(); } }}>
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;