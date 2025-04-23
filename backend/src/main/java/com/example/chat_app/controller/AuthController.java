package com.example.chat_app.controller;

import com.example.chat_app.dto.UserRegistrationDTO;
import com.example.chat_app.dto.UserDTO;
import com.example.chat_app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationDTO dto) {
        return userService.registerUser(dto);
    }
}