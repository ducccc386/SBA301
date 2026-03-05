CREATE database sba301

use sba301


-- 1. Bảng Danh mục
CREATE TABLE Categories (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL
);

-- 2. Bảng Sản phẩm
CREATE TABLE Products (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(200) NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    quantity INT DEFAULT 0,
    description NVARCHAR(MAX),
    category_id INT FOREIGN KEY REFERENCES Categories(id)
);

-- 3. Bảng Người dùng
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' -- ADMIN hoặc USER
);

-- 4. Bảng Đơn hàng
CREATE TABLE Orders (
    id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT FOREIGN KEY REFERENCES Users(id),
    order_date DATETIME DEFAULT GETDATE(),
    total_price DECIMAL(18,2),
    status NVARCHAR(50) DEFAULT N'Chờ xử lý'
);

-- 5. Bảng Chi tiết đơn hàng
CREATE TABLE OrderDetails (
    id INT PRIMARY KEY IDENTITY(1,1),
    order_id INT FOREIGN KEY REFERENCES Orders(id),
    product_id INT FOREIGN KEY REFERENCES Products(id),
    quantity INT NOT NULL,
    price DECIMAL(18,2) NOT NULL
);