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
import OrderList from './pages/admin/OrderList';
import Login from './pages/auth/Login';
import UserManagement from './pages/admin/UserManagement';
import ReviewManagement from './pages/admin/ReviewManagement';
import Register from './pages/auth/Register';
import CartPage from './pages/customer/CartPage';
import Checkout from './pages/customer/Checkout'; // THÊM DÒNG NÀY

// Import các thành phần Bảo mật và Giỏ hàng
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const AppContent = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          {/* --- USER PROTECTED ROUTES --- */}
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />

          {/* --- ADMIN ROUTES (Đã bọc ProtectedRoute) --- */}
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

          <Route path="/admin/orders" element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/reviews" element={
            <ProtectedRoute>
              <ReviewManagement />
            </ProtectedRoute>
          } />

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
      <CartProvider>
        <Router>
          <AppContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;