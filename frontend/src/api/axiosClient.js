import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Bắt buộc để gửi Cookie/Session
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor xử lý phản hồi
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về toàn bộ response thay vì chỉ response.data 
        // để code cũ ở AdminDashboard (resPro.data) không bị lỗi
        return response;
    },
    (error) => {
        const status = error.response ? error.response.status : null;

        if (status === 403) {
            console.error("🚫 Lỗi 403: Thiếu quyền Admin!");
        } else if (status === 401) {
            console.error("🔑 Lỗi 401: Hết phiên đăng nhập!");
        }

        return Promise.reject(error);
    }
);

export default axiosClient;