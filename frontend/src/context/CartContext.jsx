import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Khởi tạo giỏ hàng từ LocalStorage
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // 2. Tự động lưu vào LocalStorage khi thay đổi
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    // 3. Hàm thêm vào giỏ (hoặc tăng số lượng)
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const isExist = prevItems.find(item => item.id === product.id);
            if (isExist) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prevItems, { ...product, qty: 1 }];
        });
    };

    // 4. Hàm giảm số lượng (Dùng cho nút [-] ở CartPage)
    const decreaseQty = (productId) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId && item.qty > 1
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        );
    };

    // 5. Hàm xóa sản phẩm khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // 6. Hàm làm trống giỏ hàng (sau khi đặt hàng thành công)
    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem("cart");
    };

    // 7. Tính tổng tiền
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            decreaseQty, // Thêm hàm này để dùng ở CartPage
            removeFromCart,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);