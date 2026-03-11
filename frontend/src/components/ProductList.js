import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null); // Lưu sản phẩm đang được sửa

    const [formData, setFormData] = useState({
        name: '', price: '', quantity: '', imageUrl: '', status: 'Active', categoryId: 1
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) { console.error(error); setLoading(false); }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Khi bấm nút Sửa trên dòng
    const startEdit = (product) => {
        setEditingProduct(product.id);
        setFormData({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            imageUrl: product.imageUrl || '',
            status: product.status,
            categoryId: product.category ? product.category.id : 1
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, category: { id: parseInt(formData.categoryId) } };
        try {
            if (editingProduct) {
                // Gửi lệnh PUT để Cập nhật
                await axios.put(`http://localhost:8080/api/products/${editingProduct}`, payload);
                alert("Cập nhật thành công!");
            } else {
                // Gửi lệnh POST để Thêm mới
                await axios.post('http://localhost:8080/api/products', payload);
                alert("Thêm thành công!");
            }
            cancelEdit();
            fetchProducts();
        } catch (error) { alert("Có lỗi xảy ra!"); }
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', quantity: '', imageUrl: '', status: 'Active', categoryId: 1 });
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Xóa sản phẩm này?")) {
            await axios.delete(`http://localhost:8080/api/products/${id}`);
            fetchProducts();
        }
    };

    if (loading) return <div className="text-center mt-5"><div className="spinner-border"></div></div>;

    return (
        <div className="container mt-4 pb-5">
            {/* FORM CHUNG CHO CẢ THÊM VÀ SỬA */}
            <div className={`card shadow-sm mb-4 border-0 ${editingProduct ? 'border-warning' : 'border-success'}`} style={{ borderTop: '5px solid' }}>
                <div className="card-body">
                    <h5 className="card-title mb-3">{editingProduct ? "📝 Chỉnh Sửa Sản Phẩm" : "➕ Thêm Sản Phẩm Mới"}</h5>
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label">Tên sản phẩm</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Giá (VNĐ)</label>
                            <input type="number" name="price" className="form-control" value={formData.price} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label">Số lượng</label>
                            <input type="number" name="quantity" className="form-control" value={formData.quantity} onChange={handleInputChange} required />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Link ảnh</label>
                            <input type="text" name="imageUrl" className="form-control" value={formData.imageUrl} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-2 d-flex align-items-end gap-2">
                            <button type="submit" className="btn btn-primary flex-grow-1">{editingProduct ? "Lưu" : "Thêm"}</button>
                            {editingProduct && <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Hủy</button>}
                        </div>
                    </form>
                </div>
            </div>

            {/* BẢNG DANH SÁCH */}
            <div className="card shadow-lg border-0">
                <div className="card-header bg-dark text-white"><h4 className="mb-0">Danh Sách Kho</h4></div>
                <div className="card-body p-0">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Sản phẩm</th><th>Giá</th><th className="text-center">Số lượng</th><th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={p.imageUrl || 'https://via.placeholder.com/40'} className="rounded me-2" style={{ width: '40px', height: '40px' }} alt="" />
                                            <span className="fw-bold">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="text-danger fw-bold">{p.price?.toLocaleString()} đ</td>
                                    <td className="text-center">{p.quantity}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => startEdit(p)}>Sửa</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p.id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductList;