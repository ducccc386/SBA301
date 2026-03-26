import axiosClient from "./axiosClient";

const categoryApi = {
    // Lấy tất cả danh mục
    getAll: () => axiosClient.get('/categories'),

    // Thêm danh mục mới (Có validate dữ liệu đầu vào)
    create: (data) => {
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("Tên danh mục không được để trống!");
        }
        if (data.name.length > 100) {
            throw new Error("Tên danh mục không được vượt quá 100 ký tự!");
        }
        return axiosClient.post('/categories', data);
    },

    // Cập nhật danh mục
    update: (id, data) => {
        if (!id) throw new Error("Thiếu ID danh mục để cập nhật!");
        if (!data.name || data.name.trim().length === 0) {
            throw new Error("Tên danh mục mới không được để trống!");
        }
        return axiosClient.put(`/categories/${id}`, data);
    },

    // Xóa danh mục
    delete: (id) => {
        if (!id) throw new Error("Thiếu ID danh mục để xóa!");
        return axiosClient.delete(`/categories/${id}`);
    }
};

export default categoryApi;