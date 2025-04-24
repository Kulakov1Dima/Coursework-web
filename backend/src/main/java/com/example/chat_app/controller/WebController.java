package com.example.chat_app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Controller
public class WebController {
    @GetMapping(value = {"/", "/login", "/register", "/dashboard/**", "/messenger"})
    public String forwardAngularRoutes() {
        return "forward:/index.html";
    }
}

