import React from 'react';
import './App.css';
import ProductList from './components/ProductList'; // Không dùng dấu ngoặc nhọn { }
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand">Quản Lý Sản Phẩm</span>
        </div>
      </nav>
      <ProductList />
    </div>
  );
}

export default App;