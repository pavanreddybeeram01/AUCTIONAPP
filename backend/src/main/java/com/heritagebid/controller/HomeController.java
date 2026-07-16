package com.heritagebid.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "HeritageBid Backend Running Successfully!";
    }

    @GetMapping("/api/test")
    public String test() {
        return "API Working Successfully!";
    }
} 