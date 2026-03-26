import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. Khởi tạo state user an toàn từ localStorage
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");

            // Kiểm tra: Nếu không có dữ liệu, hoặc dữ liệu là chuỗi "undefined" 
            // thì trả về null ngay để tránh lỗi SyntaxError
            if (!savedUser || savedUser === "undefined" || savedUser === "null") {
                return null;
            }

            return JSON.parse(savedUser);
        } catch (error) {
            console.error("Lỗi khi parse dữ liệu User từ LocalStorage:", error);
            // Nếu lỗi, xóa luôn item lỗi để lần sau load lại sạch sẽ
            localStorage.removeItem("user");
            return null;
        }
    });

    // 2. Hàm Đăng nhập
    const login = (userData) => {
        // userData kỳ vọng: { username: "admin", role: "ROLE_ADMIN" }
        if (userData) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));

            // Lưu thêm các bản sao đơn lẻ để dễ truy xuất nếu cần (tùy chọn)
            if (userData.username) localStorage.setItem("username", userData.username);
            if (userData.role) localStorage.setItem("role", userData.role);
        }
    };

    // 3. Hàm Đăng xuất
    const logout = () => {
        // Xóa sạch dấu vết để tránh lỗi 403 cho phiên làm việc sau
        localStorage.clear(); // Xóa toàn bộ LocalStorage là cách sạch nhất

        // Hoặc xóa đích danh nếu bạn có lưu trữ thứ khác:
        // localStorage.removeItem("user");
        // localStorage.removeItem("username");
        // localStorage.removeItem("role");

        setUser(null);

        // Có thể thêm điều hướng về trang chủ hoặc login tại đây nếu không dùng Navigate ở Component
        // window.location.href = "/login"; 
    };

    // 4. Kiểm tra trạng thái ADMIN nhanh (Tiện lợi cho việc bảo vệ Route)
    const isAdmin = user?.role === 'ROLE_ADMIN';

    return (
        <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook tùy chỉnh để sử dụng Auth dễ dàng hơn
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth phải được sử dụng trong AuthProvider");
    }
    return context;
};