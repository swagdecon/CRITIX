package com.popflix.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.popflix.service.PasswordRecoveryService;

import lombok.RequiredArgsConstructor;

@Controller
@RestController
@RequestMapping("/v1/auth/password")
@RequiredArgsConstructor
public class PasswordRecoveryController {
}
