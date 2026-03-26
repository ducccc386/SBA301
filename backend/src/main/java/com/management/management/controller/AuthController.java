package com.management.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository; // Quan trọng
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest; // Quan trọng
import jakarta.servlet.http.HttpSession; // Quan trọng
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
// Bỏ @CrossOrigin ở đây nếu bạn đã cấu hình trong SecurityConfig để tránh xung
// đột
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        try {
            // 1. Xác thực username và password (Giữ nguyên logic quan trọng của bạn)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("username"),
                            loginRequest.get("password")));

            // 2. Lưu thông tin vào SecurityContextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // --- ĐOẠN CODE ÉP TẠO SESSION - KHÔNG ĐƯỢC THIẾU ---
            // Nó sẽ tạo ra JSESSIONID và trả về cho trình duyệt qua Set-Cookie
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext());
            // ------------------------------------------------

            // 3. Lấy thông tin User và Role để trả về cho React (Giữ nguyên logic quan
            // trọng của bạn)
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            Map<String, Object> response = new HashMap<>();
            response.put("username", userDetails.getUsername());
            response.put("role", role);

            // In ra console để bạn kiểm tra trong Eclipse/IntelliJ
            System.out.println("Đăng nhập thành công: " + userDetails.getUsername());
            System.out.println("Authorities nhận được: " + authentication.getAuthorities());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Lỗi xác thực: " + e.getMessage());
        }
    }
}