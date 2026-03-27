🛒 E-Commerce Management System - Project SBA301
Dự án SBA301 là một ứng dụng thương mại điện tử cơ bản, được xây dựng để thực hành kỹ năng Fullstack với Spring Boot và ReactJS. Đây là nền tảng vững chắc để phát triển các dự án cá nhân phức tạp hơn.

🏗️ Kiến trúc hệ thống
Frontend: ReactJS (Hooks, Context API, React Router 6).

Backend: Spring Boot 3, Spring Security, JPA.

Database: Microsoft SQL Server.

Communication: Axios (RESTful API).

📁 Cấu trúc thư mục
/backend: Mã nguồn Java, xử lý logic nghiệp vụ và bảo mật.

/frontend: Giao diện người dùng, quản lý State (Auth, Cart).

/docs: Chứa file thiết kế sba301.sql và tài liệu hướng dẫn.

🛠️ Các tính năng đã hoàn thiện
🔐 Hệ thống Tài khoản
Đăng ký: Tích hợp validate dữ liệu (Email, Số điện thoại Việt Nam, khớp mật khẩu).

Đăng nhập: Phân quyền người dùng (Role-based Authorization).

Bảo mật: Xử lý phiên làm việc qua AuthContext và LocalStorage.

🛍️ Bán hàng & Giỏ hàng
Giỏ hàng: Thêm/Xóa sản phẩm, tự động tính tổng tiền.

Thanh toán (Checkout): Thu thập thông tin giao hàng, kiểm tra userId hợp lệ trước khi lưu đơn hàng.

🛡️ Quản trị (Admin)
Dashboard: Xem danh sách đơn hàng.

Cập nhật: Thay đổi trạng thái đơn hàng (Pending, Shipping, Delivered).

Bảo vệ Route: Ngăn chặn người dùng thường truy cập trái phép trang quản trị.

🚀 Hướng dẫn cài đặt & Chạy nhanh
1. Cơ sở dữ liệu
Mở SQL Server Management Studio (SSMS).

Chạy file script tại docs/sba301.sql để tạo cấu trúc bảng và các ràng buộc (Foreign Keys).

2. Backend (Spring Boot)
Yêu cầu: JDK 17+.

Cấu hình file application.properties (URL DB, username, password).

Chạy ManagementApplication.java. API mặc định tại: http://localhost:8080.

3. Frontend (ReactJS)
Di chuyển vào thư mục: cd frontend.

Cài đặt thư viện: npm install.

Khởi chạy: npm start.

Ứng dụng chạy tại: http://localhost:3000.