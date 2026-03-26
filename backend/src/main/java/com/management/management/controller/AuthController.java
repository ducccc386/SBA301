package com.management.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000") // Cho phép React gọi API này
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            // 1. Xác thực username và password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.get("username"),
                            loginRequest.get("password")));

            // 2. Lưu thông tin vào Context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 3. Lấy thông tin User và Role để trả về cho React
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            Map<String, Object> response = new HashMap<>();
            response.put("username", userDetails.getUsername());
            response.put("role", role); // Ví dụ: ROLE_ADMIN hoặc ROLE_USER

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            e.printStackTrace(); // Dòng này sẽ in lỗi chi tiết ra console của Eclipse/IntelliJ
            return ResponseEntity.status(401).body("Lỗi: " + e.getMessage());
        }
    }
}