package com.management.management.service;

import com.management.management.entity.User;
import com.management.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Page<User> findAll(String search, Pageable pageable) {
        // Kiểm tra nếu search trống thì lấy tất cả
        if (search == null || search.trim().isEmpty()) {
            return userRepository.findAll(pageable);
        }
        // Tìm kiếm theo username hoặc email dựa trên cấu trúc bảng của bạn
        return userRepository.findByUsernameContainingOrEmailContaining(search, search, pageable);
    }

    public void delete(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("Không tìm thấy người dùng với ID: " + id);
        }
    }

    public User registerNewUser(User user) {
        // Kiểm tra trùng username
        if (userRepository.existsByUsername(user.getUsername())) {
            // Thông điệp này sẽ xuất hiện trong trường 'message' của Object lỗi
            throw new RuntimeException("Tên tài khoản này đã tồn tại!");
        }

        // Gán Role mặc định
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // Lưu mật khẩu thô trực tiếp
        return userRepository.save(user);
    }
}