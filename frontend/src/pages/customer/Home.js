import React, { useEffect, useState } from 'react';
import productApi from '../../api/productApi';
import categoryApi from '../../api/categoryApi';

// Thêm searchTerm vào đây để nhận từ App.js
const Home = ({ searchTerm }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prodRes = await productApi.getAll();
                const catRes = await categoryApi.getAll();
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (err) {
                console.error("Lỗi gọi API:", err);
            }
        };
        fetchData();
    }, []);

    // LOGIC LỌC KÉP: Lọc theo Danh mục VÀ Tên sản phẩm
    const filteredProducts = products.filter(p => {
        // Kiểm tra danh mục
        const matchesCategory = selectedCategory
            ? p.category?.id === selectedCategory
            : true;

        // Kiểm tra từ khóa tìm kiếm (không phân biệt hoa thường)
        const matchesSearch = searchTerm
            ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="row mt-4">
            {/* THANH BÊN TRÁI */}
            <div className="col-md-3">
                <div className="card shadow-sm border-0 mb-4">
                    <div className="card-header bg-dark text-white fw-bold">Danh Mục</div>
                    <ul className="list-group list-group-flush">
                        <li
                            className={`list-group-item list-group-item-action cursor-pointer ${selectedCategory === null ? 'active' : ''}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedCategory(null)}
                        >
                            Tất cả sản phẩm
                        </li>
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                className={`list-group-item list-group-item-action cursor-pointer ${selectedCategory === cat.id ? 'active' : ''}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM BÊN PHẢI */}
            <div className="col-md-9">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold m-0">
                        {selectedCategory ? `Sản phẩm theo danh mục` : "Tất cả sản phẩm"}
                    </h4>
                    {searchTerm && (
                        <span className="badge bg-info text-dark">Đang tìm: {searchTerm}</span>
                    )}
                </div>

                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {filteredProducts.map(p => (
                        <div className="col" key={p.id}>
                            <div className="card h-100 border-0 shadow-sm product-card">
                                <img
                                    src={p.imageUrl || 'https://via.placeholder.com/200'}
                                    className="card-img-top p-3"
                                    style={{ height: '200px', objectFit: 'contain' }}
                                    alt={p.name}
                                />
                                <div className="card-body text-center">
                                    <h6 className="card-title text-truncate">{p.name}</h6>
                                    <p className="card-text text-danger fw-bold">{p.price?.toLocaleString()} đ</p>
                                    <button className="btn btn-outline-dark btn-sm rounded-pill w-100 fw-bold">
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center mt-5 py-5 border rounded bg-light">
                        <h5 className="text-muted">Không tìm thấy sản phẩm nào phù hợp.</h5>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;