import axiosClient from './axiosClient';

const userApi = {
    // Lấy danh sách user phân trang
    getAllUsers: (params) => {
        return axiosClient.get('/admin/all-users', { params });
    },
    // Xóa user (vì bảng của bạn chưa có trường enabled để khóa)
    deleteUser: (id) => {
        return axiosClient.delete(`/admin/all-users/${id}`);
    }
};

export default userApi;