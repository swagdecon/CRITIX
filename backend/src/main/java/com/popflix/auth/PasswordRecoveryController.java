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

    private final PasswordRecoveryService passwordRecoveryService;

    @PostMapping("/password-recovery-email")
    public void sendPasswordRecoveryEmail(@RequestBody String email) {
        System.out.println(email);
        if (passwordRecoveryService.authenticateExistingEmail(email)) {
            System.out.println("Email exists, sending recovery email.");
            passwordRecoveryService.sendPasswordRecoveryEmail(email);
        } else {
            System.out.println("Email does not exist.");
        }
    }

    @PostMapping("reset-password/{token}")
    public String resetPassword(@RequestBody String encrypedEmail, String newPassword) {
        return passwordRecoveryService.resetUserPwd(encrypedEmail, newPassword);
    }
}
