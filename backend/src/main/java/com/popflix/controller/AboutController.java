package com.popflix.controller;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContext;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.popflix.repository.UserRepository;
import com.popflix.repository.WatchlistRepository;

@Controller
public class AboutController {

 @Autowired
 WatchlistRepository watchlistRepository;
 @Autowired
 UserRepository userRepository;

//  private Long getUserId() {
//   SecurityContext context = SecurityContextHolder.getContext();
//   Authentication authentication = context.getAuthentication();
//   Long id = userRepository.findByUsername(authentication.getName()).getId();
//   return id;
//  }

 @GetMapping("/about")
 public String getAboutPage(Model model) {
  return "about";
 }

 @GetMapping("/credits")
 public String getCreditPage(Model model) {
  return "credits";
 }
}