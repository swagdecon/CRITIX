package com.popflix.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import com.popflix.repository.UserRepository;

@Controller
public class AboutController {

    @Autowired
    UserRepository userRepository;

    @GetMapping("/about")
    public String getAboutPage(ModelMap model) {
        return "about";
    }

    @GetMapping("/credits")
    public String getCreditPage(ModelMap model) {
        return "credits";
    }
}