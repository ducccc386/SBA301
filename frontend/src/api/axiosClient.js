import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // Quan trọng để gửi Cookie/Session
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor chỉ dùng để bắt lỗi tập trung, KHÔNG gọt vỏ .data
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về nguyên vẹn object của Axios (có .data, .status, .headers)
        return response;
    },
    (error) => {
        if (error.response) {
            const status = error.response.status;
            if (status === 403) console.error("🚫 Lỗi 403: Không có quyền Admin!");
            if (status === 401) console.error("🔑 Lỗi 401: Phiên đăng nhập hết hạn!");
        }
        return Promise.reject(error);
    }
);

export default axiosClient;