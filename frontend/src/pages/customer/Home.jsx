import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext'; // THÊM DÒNG NÀY

const Home = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { user } = useAuth();
    const { addToCart } = useCart(); // LẤY HÀM THÊM GIỎ HÀNG
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
        // KIỂM TRA ĐĂNG NHẬP TRƯỚC
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            navigate('/login', { state: { from: window.location.pathname } });
            return;
        }

        // THỰC HIỆN THÊM VÀO GIỎ HÀNG THẬT
        addToCart(product);
        alert(`Đã thêm ${product.name} vào giỏ hàng thành công!`);
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory ? p.category?.id === selectedCategory : true;
        const matchesSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="row mt-4 px-3" style={{ minHeight: '100vh', color: 'white' }}>
            {/* THANH BÊN DANH MỤC */}
            <div className="col-md-3">
                <div className="card bg-dark text-white border-secondary mb-4 shadow">
                    <div className="card-header bg-black fw-bold border-secondary">Danh Mục</div>
                    <ul className="list-group list-group-flush">
                        <li
                            className={`list-group-item bg-dark text-white border-secondary cursor-pointer ${selectedCategory === null ? 'active bg-primary' : ''}`}
                            onClick={() => setSelectedCategory(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            Tất cả sản phẩm
                        </li>
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                className={`list-group-item bg-dark text-white border-secondary cursor-pointer ${selectedCategory === cat.id ? 'active bg-primary' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="col-md-9">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {filteredProducts.map(p => (
                        <div className="col" key={p.id}>
                            <div className="card h-100 border-secondary bg-dark text-white shadow-sm product-card">
                                <img
                                    src={p.imageUrl || 'https://via.placeholder.com/200'}
                                    className="card-img-top p-3 bg-white"
                                    style={{ height: '200px', objectFit: 'contain' }}
                                    alt={p.name}
                                />
                                <div className="card-body text-center">
                                    <h6 className="card-title text-truncate fw-bold">{p.name}</h6>
                                    <p className="text-danger fw-bold fs-5">{p.price?.toLocaleString()} đ</p>
                                    <button
                                        className="btn btn-outline-light btn-sm rounded-pill w-100 fw-bold mt-2 shadow-none"
                                        onClick={() => handleAddToCart(p)}
                                    >
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center mt-5 py-5 border border-secondary rounded bg-dark">
                        <h5 className="text-secondary">Không tìm thấy sản phẩm nào phù hợp.</h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;