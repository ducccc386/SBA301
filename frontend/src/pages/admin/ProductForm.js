import React, { useEffect, useState } from 'react';
import categoryApi from '../../api/categoryApi';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', price: '', quantity: '', imageUrl: '', categoryId: ''
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Load danh mục để chọn
        categoryApi.getAll().then(res => setCategories(res.data));
        // Nếu là Sửa thì điền dữ liệu cũ vào form
        if (product) setFormData({ ...product, categoryId: product.category?.id || '' });
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
                {product ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
            </div>
            <form className="card-body" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Tên sản phẩm</label>
                        <input type="text" className="form-control" required
                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Giá (đ)</label>
                        <input type="number" className="form-control" required
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="form-label">Số lượng</label>
                        <input type="number" className="form-control" required
                            value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Link ảnh (URL)</label>
                        <input type="text" className="form-control"
                            value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Danh mục</label>
                        <select className="form-select" required value={formData.categoryId}
                            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>
                <div className="mt-3">
                    <button type="submit" className="btn btn-success me-2 px-4">Lưu</button>
                    <button type="button" className="btn btn-secondary px-4" onClick={onCancel}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;