import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Home = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { user } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await productApi.getAllActive();
                const catRes = await categoryApi.getAll();
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Lỗi gọi API:", err);
            }
        };
        fetchData();
    }, []);

    const handleAddToCart = (product) => {
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }
        addToCart(product);
        // Thay vì alert đơn điệu, bạn có thể dùng toast sau này
        alert(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory ? p.category?.id === selectedCategory : true;
        const matchesSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    return (
        <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>

            {/* --- 1. HERO SECTION (BANNER) --- */}
            <div className="container-fluid p-0 mb-5">
                <div className="position-relative" style={{ height: '400px', overflow: 'hidden' }}>
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070"
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', opacity: '0.6' }}
                        alt="Hero Banner"
                    />
                    <div className="position-absolute top-50 start-50 translate-middle text-center w-100">
                        <h1 className="display-3 fw-bold text-uppercase" style={{ letterSpacing: '5px' }}>SBA301 PREMIUM</h1>
                        <p className="fs-5 text-secondary">Khám phá bộ sưu tập công nghệ mới nhất 2026</p>
                        <button className="btn btn-primary px-5 py-2 rounded-pill fw-bold mt-3 shadow">MUA NGAY</button>
                    </div>
                </div>
            </div>

            <div className="container pb-5">
                <div className="row">
                    {/* --- 2. SIDEBAR DANH MỤC --- */}
                    <div className="col-md-3 mb-4">
                        <div className="card bg-dark border-secondary shadow-lg sticky-top" style={{ top: '20px' }}>
                            <div className="card-header bg-black py-3 border-secondary">
                                <h5 className="m-0 fw-bold text-primary text-uppercase small">Danh mục sản phẩm</h5>
                            </div>
                            <div className="list-group list-group-flush">
                                <button
                                    className={`list-group-item bg-dark text-white border-secondary py-3 text-start transition-all ${selectedCategory === null ? 'active bg-primary border-primary' : ''}`}
                                    onClick={() => setSelectedCategory(null)}
                                    style={{ borderLeft: selectedCategory === null ? '4px solid white' : 'none' }}
                                >
                                    Tất cả sản phẩm
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`list-group-item bg-dark text-white border-secondary py-3 text-start transition-all ${selectedCategory === cat.id ? 'active bg-primary border-primary' : ''}`}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{ borderLeft: selectedCategory === cat.id ? '4px solid white' : 'none' }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- 3. DANH SÁCH SẢN PHẨM --- */}
                    <div className="col-md-9">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold m-0 text-uppercase border-start border-primary border-4 ps-3">
                                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Tất cả sản phẩm'}
                            </h4>
                            <span className="text-secondary small">Hiển thị {filteredProducts.length} sản phẩm</span>
                        </div>

                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            {filteredProducts.map(p => (
                                <div className="col" key={p.id}>
                                    <div className="card h-100 border-secondary bg-dark text-white shadow-sm product-card-hover overflow-hidden" style={{ borderRadius: '15px', transition: '0.3s' }}>
                                        {/* Hình ảnh với lớp phủ hover */}
                                        <div className="position-relative bg-white" style={{ height: '220px' }}>
                                            <img
                                                src={p.imageUrl || 'https://via.placeholder.com/200'}
                                                className="w-100 h-100 p-4"
                                                style={{ objectFit: 'contain' }}
                                                alt={p.name}
                                            />
                                            <div className="product-badge position-absolute top-0 start-0 m-2 badge bg-danger">HOT</div>
                                        </div>

                                        <div className="card-body d-flex flex-column text-center">
                                            <p className="text-secondary small mb-1">{p.category?.name || 'General'}</p>
                                            <h6 className="card-title fw-bold text-truncate mb-2">{p.name}</h6>
                                            <div className="mt-auto">
                                                <p className="text-primary fw-bold fs-5 mb-3">{p.price?.toLocaleString()} đ</p>
                                                <button
                                                    className="btn btn-outline-primary w-100 rounded-pill fw-bold py-2 shadow-none"
                                                    onClick={() => handleAddToCart(p)}
                                                >
                                                    <i className="bi bi-cart-plus me-2"></i>Thêm vào giỏ
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Thông báo khi trống */}
                        {filteredProducts.length === 0 && (
                            <div className="text-center mt-5 py-5 border border-secondary border-dashed rounded-3 bg-dark">
                                <i className="bi bi-search display-1 text-secondary opacity-25"></i>
                                <h5 className="text-secondary mt-3">Rất tiếc, chúng tôi không tìm thấy sản phẩm phù hợp.</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CSS INLINE ĐỂ TRÁNH TẠO FILE MỚI */}
            <style>
                {`
                    .product-card-hover:hover {
                        transform: translateY(-10px);
                        border-color: #0d6efd !important;
                        box-shadow: 0 10px 20px rgba(13, 110, 253, 0.2) !important;
                    }
                    .transition-all { transition: all 0.3s ease; }
                    .list-group-item:hover { background-color: #212529 !important; }
                    .border-dashed { border-style: dashed !important; }
                `}
            </style>
        </div>
    );
};

export default Home;