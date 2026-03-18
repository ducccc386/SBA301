import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    // Chặn nếu role không phải ADMIN
    if (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập trang Quản trị!");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;