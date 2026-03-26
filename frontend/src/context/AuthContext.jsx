import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Lưu thông tin user { username, role }

    const login = (userData) => setUser(userData);
    const logout = () => {
        // 1. Xóa thông tin user khỏi LocalStorage
        localStorage.removeItem("user");

        // 2. Cập nhật state về null để giao diện thay đổi ngay lập tức
        setUser(null);

        // 3. (Tùy chọn) Chuyển hướng về trang login
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);