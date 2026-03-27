import axiosClient from "./axiosClient";

const authApi = {
    // Hàm đăng nhập (Giữ nguyên logic khớp với Controller của bạn)
    login: (username, password) => {
        return axiosClient.post("/auth/login", {
            username: username,
            password: password
        });
    },

    // Hàm đăng ký (Gửi dữ liệu User thô sang Backend)
    register: (userData) => {
        // userData sẽ bao gồm: username, password, email, phone, address...
        return axiosClient.post("/auth/register", userData);
    }
};

export default authApi;