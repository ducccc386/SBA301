import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các Component
import Navbar from './components/layout/Navbar';
import Home from './pages/customer/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import CategoryManagement from './pages/admin/CategoryManagement';
import Login from './pages/auth/Login';

// Import các thành phần Bảo mật
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppContent = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {/* --- PHẦN BỔ SUNG: Cấu hình hiển thị thông báo --- */}
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
        style={{ zIndex: 9999 }} // Quan trọng: Đảm bảo nổi lên trên Modal
      />

      {!isAdminPage && (
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}

      <div className={isAdminPage ? "" : "container mt-4"}>
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/login" element={<Login />} />

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