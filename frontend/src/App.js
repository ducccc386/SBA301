import React, { useState } from 'react'; // Thêm useState ở đây
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/customer/Home';
import AdminDashboard from './pages/admin/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // 1. Tạo state để lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      {/* 2. Truyền searchTerm và hàm thay đổi nó vào Navbar */}
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="container mt-4">
        <Routes>
          {/* 3. Truyền searchTerm xuống Home để lọc sản phẩm */}
          <Route path="/" element={<Home searchTerm={searchTerm} />} />

          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;