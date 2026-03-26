import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import các Component
import Navbar from './components/layout/Navbar';
import Home from './pages/customer/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import Login from './pages/auth/Login';

// Import các thành phần Bảo mật
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Tạo một component phụ để xử lý logic ẩn hiện Navbar
const AppContent = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();

  // Kiểm tra nếu đường dẫn bắt đầu bằng '/admin'
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* CHỈ HIỂN THỊ NAVBAR CLIENT NẾU KHÔNG PHẢI TRANG ADMIN */}
      {!isAdminPage && (
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}

      <div className={isAdminPage ? "" : "container mt-4"}>
        <Routes>
          {/* 3. Trang chủ: Nhận searchTerm để lọc sản phẩm */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />

          {/* 4. Trang Login */}
          <Route path="/login" element={<Login />} />

          {/* 5. Trang Admin: Được bảo vệ bởi ProtectedRoute */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </>
  );
};

function App() {
  // Giữ nguyên state Tìm kiếm từ Giai đoạn 2
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <AuthProvider> {/* 1. Bọc Context ngoài cùng để quản lý Login */}
      <Router>
        <AppContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Router>
    </AuthProvider>
  );
}

export default App;