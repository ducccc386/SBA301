package com.management.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.management.management.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Tìm User từ Database (Sử dụng đường dẫn đầy đủ tới Entity của bạn)
        com.management.management.entity.User userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user: " + username));

        // 2. Trả về User của Spring Security để xác thực
        // Lưu ý: password lấy từ userEntity chính là chuỗi $2a$12$... bạn đã lưu trong
        // DB
        return org.springframework.security.core.userdetails.User
                .withUsername(userEntity.getUsername())
                .password(userEntity.getPassword())
                .roles(userEntity.getRole()) // Spring sẽ tự hiểu 'USER' thành 'ROLE_USER'
                .build();
    }
}