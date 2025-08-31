package com.critix.controller;

import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.critix.repository.UserRepository;
import com.stripe.exception.SignatureVerificationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Scanner;

@RestController
@RequestMapping("/api/stripe")
public class PaymentController {

    @Autowired
    private UserRepository userRepository;

    private final String endpointSecret = "whsec_xxx"; // 👈 Your Stripe webhook secret

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) {
        String payload = "";
        try (Scanner scanner = new Scanner(request.getInputStream(), "UTF-8")) {
            payload = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error reading payload");
        }

        String sigHeader = request.getHeader("Stripe-Signature");
        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }

        // ✅ Handle successful checkout
        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .map(obj -> (Session) obj)
                    .orElse(null);

            if (session != null) {
                String userId = session.getClientReferenceId(); // 👈 from your frontend
                if (userId != null) {
                    userRepository.findById(userId).ifPresent(user -> {
                        user.setIsUltimateUser(true);
                        userRepository.save(user);
                    });
                }
            }
        }

        return ResponseEntity.ok("success");
    }
}
