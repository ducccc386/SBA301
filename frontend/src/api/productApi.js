import axiosClient from "./axiosClient";

const productApi = {
    // Lấy tất cả sản phẩm
    getAll: () => axiosClient.get('/products'),

    // Lấy sản phẩm theo ID
    getById: (id) => axiosClient.get(`/products/${id}`),

    // LẤY SẢN PHẨM THEO DANH MỤC (Mới thêm)
    // Giả sử Backend của bạn có endpoint: /api/products/category/{id}
    getByCategory: (categoryId) => axiosClient.get(`/products/category/${categoryId}`),

    // Thêm mới
    create: (data) => axiosClient.post('/products', data),

    // Cập nhật
    update: (id, data) => axiosClient.put(`/products/${id}`, data),

    // Xóa
    delete: (id) => axiosClient.delete(`/products/${id}`),
};

export default productApi;