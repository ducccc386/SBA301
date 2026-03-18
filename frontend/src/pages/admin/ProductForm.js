import React, { useEffect, useState } from 'react';
import categoryApi from '../../api/categoryApi';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', price: '', quantity: '', imageUrl: '',
        categoryId: '', description: '', status: 'Active'
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryApi.getAll().then(res => setCategories(res.data));
        if (product) {
            setFormData({
                ...product,
                categoryId: product.category?.id?.toString() || '',
                description: product.description || '',
                status: product.status || 'Active'
            });
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            name: formData.name,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            imageUrl: formData.imageUrl,
            status: formData.status,
            description: formData.description,
            category: { id: Number(formData.categoryId) }
        };
        onSave(dataToSave); // Gọi hàm handleSaveProduct ở Dashboard
    };

    return (
        <div className="card shadow-sm border-0 bg-dark text-white">
            <div className="card-header bg-primary text-white fw-bold py-3">
                {product ? '📝 CẬP NHẬT: ' + product.name : '➕ THÊM SẢN PHẨM MỚI'}
            </div>
            <form className="card-body p-4" onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-8">
                        <label className="form-label small fw-bold">Tên sản phẩm</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" required
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    {/* Ô NHẬP ẢNH MỚI THÊM VÀO ĐÂY */}
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-warning">Xem trước ảnh</label>
                        <div className="border border-secondary rounded d-flex align-items-center justify-content-center bg-black" style={{ height: '38px' }}>
                            {formData.imageUrl ? <img src={formData.imageUrl} height="30" alt="Preview" /> : <small>Trống</small>}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label small fw-bold text-info">Link ảnh sản phẩm (URL)</label>
                        <input type="text" className="form-control bg-secondary text-white border-0" required placeholder="https://..."
                            value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Giá bán (đ)</label>
                        <input type="number" className="form-control bg-secondary text-white border-0" required
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Số lượng kho</label>
                        <input type="number" className="form-control bg-secondary text-white border-0" required
                            value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Danh mục</label>
                        <select className="form-select bg-secondary text-white border-0" required
                            value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Trạng thái</label>
                        <select className="form-select bg-secondary text-white border-0"
                            value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Active">Hoạt động (Active)</option>
                            <option value="Inactive">Tạm ngưng (Inactive)</option>
                        </select>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label small fw-bold">Mô tả chi tiết</label>
                        <textarea className="form-control bg-secondary text-white border-0" rows="3"
                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
                    </div>
                </div>

                <div className="mt-4 d-flex justify-content-end border-top pt-3">
                    <button type="button" className="btn btn-outline-light me-2 px-4" onClick={onCancel}>Hủy bỏ</button>
                    <button type="submit" className="btn btn-primary px-4 fw-bold shadow">LƯU SẢN PHẨM</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;