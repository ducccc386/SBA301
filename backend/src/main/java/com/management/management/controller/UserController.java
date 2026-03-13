package com.management.management.controller;

import com.management.management.entity.User;
import com.management.management.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService; // Sử dụng Service thay vì Repository

    @GetMapping
    public List<User> getAll() {
        return userService.getAllUsers();
    }
}