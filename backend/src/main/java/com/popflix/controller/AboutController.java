package com.popflix.controller;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContext;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;

import com.popflix.repository.UserRepository;

@Controller
public class AboutController {

    @Autowired
    UserRepository userRepository;

    // private Long getUserId() {
    // SecurityContext context = SecurityContextHolder.getContext();
    // Authentication authentication = context.getAuthentication();
    // Long id = userRepository.findByUsername(authentication.getName()).getId();
    // return id;
    // }

    @GetMapping("/about")
    public String getAboutPage(ModelMap model) {
        return "about";
    }

    @GetMapping("/credits")
    public String getCreditPage(ModelMap model) {
        return "credits";
    }
}