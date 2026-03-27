import axiosClient from "./axiosClient";

const reviewApi = {
    // Lấy danh sách đánh giá có phân trang và tìm kiếm
    getAll: (params) => {
        const url = '/admin/reviews';
        return axiosClient.get(url, { params });
    },
    // Xóa một đánh giá
    delete: (id) => {
        const url = `/admin/reviews/${id}`;
        return axiosClient.delete(url);
    }
};

export default reviewApi;