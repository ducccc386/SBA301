import React, { useEffect, useState } from 'react';
import categoryApi from '../../api/categoryApi';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '', price: '', quantity: '', imageUrl: '',
        categoryId: '', description: '', status: 'Active'
    });

    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({}); // Lưu trữ thông báo lỗi

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

    // Hàm kiểm tra dữ liệu trước khi lưu
    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Tên sản phẩm không được để trống";
        } else if (formData.name.length < 3) {
            newErrors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
        }

        if (!formData.price || Number(formData.price) <= 0) {
            newErrors.price = "Giá bán phải lớn hơn 0";
        }

        if (formData.quantity === '' || Number(formData.quantity) < 0) {
            newErrors.quantity = "Số lượng không được âm";
        }

        if (!formData.categoryId) {
            newErrors.categoryId = "Vui lòng chọn một danh mục";
        }

        if (!formData.imageUrl.trim()) {
            newErrors.imageUrl = "Vui lòng nhập link ảnh sản phẩm";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const dataToSave = {
                ...formData,
                price: Number(formData.price),
                quantity: Number(formData.quantity),
                category: { id: Number(formData.categoryId) }
            };
            onSave(dataToSave);
        }
    };

    // Hàm hỗ trợ đổi giá trị input và xóa lỗi tương ứng ngay lập tức
    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: null });
        }
    };

    return (
        <div className="card shadow-lg border-0 bg-dark text-white">
            <div className={`card-header ${product ? 'bg-warning text-dark' : 'bg-primary text-white'} fw-bold py-3`}>
                {product ? '📝 CẬP NHẬT: ' + product.name : '➕ THÊM SẢN PHẨM MỚI'}
            </div>

            <form className="card-body p-4" onSubmit={handleSubmit}>
                <div className="row g-3">
                    {/* Tên sản phẩm */}
                    <div className="col-md-8">
                        <label className="form-label small fw-bold">Tên sản phẩm</label>
                        <input type="text"
                            className={`form-control bg-secondary text-white border-0 ${errors.name ? 'is-invalid' : ''}`}
                            value={formData.name}
                            onChange={e => handleChange('name', e.target.value)} />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Xem trước ảnh */}
                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-warning">Xem trước</label>
                        <div className="border border-secondary rounded d-flex align-items-center justify-content-center bg-black" style={{ height: '38px' }}>
                            {formData.imageUrl ? <img src={formData.imageUrl} height="30" alt="Preview" /> : <small className="text-muted">No Image</small>}
                        </div>
                    </div>

                    {/* Link ảnh */}
                    <div className="col-md-12">
                        <label className="form-label small fw-bold text-info">Link ảnh sản phẩm (URL)</label>
                        <input type="text"
                            className={`form-control bg-secondary text-white border-0 ${errors.imageUrl ? 'is-invalid' : ''}`}
                            placeholder="https://example.com/image.jpg"
                            value={formData.imageUrl}
                            onChange={e => handleChange('imageUrl', e.target.value)} />
                        {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
                    </div>

                    {/* Giá bán */}
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Giá bán (đ)</label>
                        <input type="number"
                            className={`form-control bg-secondary text-white border-0 ${errors.price ? 'is-invalid' : ''}`}
                            value={formData.price}
                            onChange={e => handleChange('price', e.target.value)} />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>

                    {/* Số lượng */}
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Số lượng kho</label>
                        <input type="number"
                            className={`form-control bg-secondary text-white border-0 ${errors.quantity ? 'is-invalid' : ''}`}
                            value={formData.quantity}
                            onChange={e => handleChange('quantity', e.target.value)} />
                        {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                    </div>

                    {/* Danh mục */}
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Danh mục</label>
                        <select
                            className={`form-select bg-secondary text-white border-0 ${errors.categoryId ? 'is-invalid' : ''}`}
                            value={formData.categoryId}
                            onChange={e => handleChange('categoryId', e.target.value)}>
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
                        </select>
                        {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                    </div>

                    {/* Trạng thái */}
                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Trạng thái</label>
                        <select className="form-select bg-secondary text-white border-0"
                            value={formData.status} onChange={e => handleChange('status', e.target.value)}>
                            <option value="Active">Hoạt động (Active)</option>
                            <option value="Inactive">Tạm ngưng (Inactive)</option>
                        </select>
                    </div>

                    {/* Mô tả */}
                    <div className="col-md-12">
                        <label className="form-label small fw-bold">Mô tả chi tiết</label>
                        <textarea className="form-control bg-secondary text-white border-0" rows="3"
                            value={formData.description}
                            onChange={e => handleChange('description', e.target.value)}></textarea>
                    </div>
                </div>

                <div className="mt-4 d-flex justify-content-end border-top pt-3">
                    <button type="button" className="btn btn-outline-light me-2 px-4" onClick={onCancel}>Hủy bỏ</button>
                    <button type="submit" className={`btn ${product ? 'btn-warning' : 'btn-primary'} px-4 fw-bold shadow`}>
                        {product ? 'CẬP NHẬT NGAY' : 'THÊM SẢN PHẨM'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;