import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các Component
import Navbar from './components/layout/Navbar';
import Home from './pages/customer/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import OrderList from './pages/admin/OrderList'; // BỔ SUNG: Khắc phục lỗi "No routes matched"
import Login from './pages/auth/Login';

// Import các thành phần Bảo mật
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppContent = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />

      {!isAdminPage && (
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}

      <div className={isAdminPage ? "" : "container mt-4"}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/login" element={<Login />} />

          {/* --- ADMIN ROUTES (Bọc trong ProtectedRoute để tránh lỗi 403) --- */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin/categories" element={
            <ProtectedRoute>
              <CategoryManagement />
            </ProtectedRoute>
          } />

          {/* BỔ SUNG QUAN TRỌNG: Route này giải quyết lỗi màn hình trắng khi vào /admin/orders */}
          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          } />

          {/* --- CATCH ALL: Chống lỗi khi vào đường dẫn không tồn tại --- */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <AuthProvider>
      <Router>
        <AppContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </Router>
    </AuthProvider>
  );
}

export default App;