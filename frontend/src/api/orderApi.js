import axiosClient from "./axiosClient";

const orderApi = {
    /**
     * Lấy danh sách đơn hàng (Admin)
     * URL gọi thực tế: http://localhost:8080/api/admin/orders
     */
    getAllOrders: (params) => {
        // Nếu axiosClient của bạn chưa có baseURL là /api, hãy thêm /api vào đây
        const url = '/admin/orders';
        return axiosClient.get(url, { params });
    },

    /**
     * Cập nhật trạng thái đơn hàng
     */
    updateStatus: (id, status) => {
        const url = `/admin/orders/${id}/status`;
        return axiosClient.put(url, { status });
    },

    /**
     * Lấy chi tiết đơn hàng theo ID
     */
    getById: (id) => {
        const url = `/admin/orders/${id}`;
        return axiosClient.get(url);
    }
};

export default orderApi;