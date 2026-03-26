import React, { useEffect, useState } from 'react';
import categoryApi from '../../api/categoryApi';
import AdminNavbar from '../../components/layout/AdminNavbar';
import Sidebar from '../../components/layout/AdminSidebar';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });

    // --- STATE TÌM KIẾM & PHÂN TRANG ---
    const [searchCat, setSearchCat] = useState("");
    const [catPage, setCatPage] = useState(1);
    const catsPerPage = 7;

    const userName = localStorage.getItem('username') || "Quản trị viên";

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAll();
            setCategories(response.data);
        } catch (error) {
            toast.error("Không thể tải danh sách danh mục!");
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIC LỌC VÀ PHÂN TRANG ---
    const filteredCats = categories.filter(c =>
        c.name.toLowerCase().includes(searchCat.toLowerCase())
    );
    const totalCatPages = Math.ceil(filteredCats.length / catsPerPage);
    const currentCats = filteredCats.slice((catPage - 1) * catsPerPage, catPage * catsPerPage);

    const handleSave = async (e) => {
        e.preventDefault();
        const idToast = toast.loading("Đang xử lý...");
        try {
            if (currentCategory.id) {
                await categoryApi.update(currentCategory.id, { name: currentCategory.name });
                toast.update(idToast, { render: "Cập nhật thành công! 🎉", type: "success", isLoading: false, autoClose: 2000 });
            } else {
                await categoryApi.create({ name: currentCategory.name });
                toast.update(idToast, { render: "Thêm mới thành công! 🚀", type: "success", isLoading: false, autoClose: 2000 });
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.update(idToast, { render: "Lỗi hệ thống!", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("⚠️ Bạn có chắc chắn muốn xóa danh mục này?")) {
            const idToast = toast.loading("Đang xóa...");
            try {
                await categoryApi.delete(id);
                toast.update(idToast, { render: "Đã xóa thành công!", type: "success", isLoading: false, autoClose: 2000 });
                fetchCategories();
            } catch (error) {
                toast.update(idToast, { render: "Không thể xóa danh mục đang có sản phẩm!", type: "error", isLoading: false, autoClose: 3000 });
            }
        }
    };

    return (
        <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f9fc' }}>
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column">
                <AdminNavbar adminName={userName} />

                <div className="p-4">
                    {/* Header + Search */}
                    <div className="row align-items-center mb-4">
                        <div className="col-md-3">
                            <h3 className="fw-bold text-dark m-0">DANH MỤC</h3>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group shadow-sm rounded-pill overflow-hidden bg-white">
                                <span className="input-group-text bg-white border-0 ps-3"><i className="bi bi-search"></i></span>
                                <input
                                    type="text"
                                    className="form-control border-0 shadow-none"
                                    placeholder="Tìm tên danh mục..."
                                    value={searchCat}
                                    onChange={(e) => { setSearchCat(e.target.value); setCatPage(1); }}
                                />
                            </div>
                        </div>
                        <div className="col-md-3 text-end">
                            <button className="btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm"
                                onClick={() => { setCurrentCategory({ id: null, name: '' }); setIsModalOpen(true); }}>
                                + Thêm mới
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                        <table className="table table-hover align-middle m-0">
                            <thead className="bg-light">
                                <tr className="text-secondary small fw-bold text-uppercase">
                                    <th className="ps-4 py-3">ID</th>
                                    <th>Tên danh mục</th>
                                    <th className="text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="3" className="text-center py-5">Đang tải...</td></tr>
                                ) : currentCats.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="ps-4 text-muted fw-bold">#{cat.id}</td>
                                        <td><span className="fw-bold text-dark">{cat.name}</span></td>
                                        <td className="text-center">
                                            <button className="btn btn-sm btn-outline-primary me-2 rounded-pill px-3"
                                                onClick={() => { setCurrentCategory(cat); setIsModalOpen(true); }}>Sửa</button>
                                            <button className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                onClick={() => handleDelete(cat.id)}>Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PHÂN TRANG DANH MỤC */}
                        <div className="d-flex justify-content-between align-items-center p-3 border-top">
                            <small className="text-muted">Tổng: {filteredCats.length} danh mục</small>
                            <div className="pagination pagination-sm m-0">
                                <button className="page-link border-0 rounded-pill me-1 shadow-none" disabled={catPage === 1} onClick={() => setCatPage(catPage - 1)}>Trước</button>
                                {[...Array(totalCatPages)].map((_, i) => (
                                    <button key={i} className={`page-link border-0 rounded-circle mx-1 shadow-none ${catPage === i + 1 ? 'bg-primary text-white' : ''}`} onClick={() => setCatPage(i + 1)}>{i + 1}</button>
                                ))}
                                <button className="page-link border-0 rounded-pill ms-1 shadow-none" disabled={catPage === totalCatPages || totalCatPages === 0} onClick={() => setCatPage(catPage + 1)}>Sau</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg rounded-4">
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="fw-bold">{currentCategory.id ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</h5>
                                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body p-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg border-2 shadow-none"
                                        style={{ borderRadius: '12px' }}
                                        value={currentCategory.name}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
                                        placeholder="Nhập tên danh mục..."
                                        required
                                    />
                                </div>
                                <div className="modal-footer border-0 p-4 pt-0">
                                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                    <button type="submit" className="btn btn-primary rounded-pill px-4 shadow">Lưu lại</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;