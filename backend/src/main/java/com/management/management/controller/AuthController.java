package com.management.management.controller;

import com.management.management.entity.User;
import com.management.management.service.UserService; // Đảm bảo import service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService; // Sử dụng Service để xử lý logic đăng ký cho sạch code

    // --- GIỮ NGUYÊN LOGIC LOGIN QUAN TRỌNG CỦA BẠN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletRequest request) {
        try {
            // 1. Xác thực username và password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("username"),
                            loginRequest.get("password")));

            // 2. Lưu thông tin vào SecurityContextHolder
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // --- ĐOẠN CODE ÉP TẠO SESSION - KHÔNG ĐƯỢC THIẾU ---
            // Tạo JSESSIONID để trình duyệt lưu Cookie, phục vụ các request sau (như Đơn
            // hàng/Review)
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext());
            // ------------------------------------------------

            // 3. Trả về thông tin User và Role cho React
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            Map<String, Object> response = new HashMap<>();
            response.put("username", userDetails.getUsername());
            response.put("role", role);

            System.out.println("Đăng nhập thành công: " + userDetails.getUsername());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Lỗi xác thực: " + e.getMessage());
        }
    }

    // --- LOGIC ĐĂNG KÝ (GỌI SERVICE, KHÔNG MÃ HÓA) ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Gọi service để lưu user
            userService.registerNewUser(user);

            // Trả về một Map (JSON) chứa thông báo thành công
            // Việc trả về Map giúp Frontend dễ dàng lấy dữ liệu hơn
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đăng ký tài khoản " + user.getUsername() + " thành công!");

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            // Trả về lỗi 400 và bọc message vào một Map để tránh lỗi render Object ở React
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Lỗi hệ thống không xác định!");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}