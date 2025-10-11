package com.critix.controller;

import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

import io.github.cdimascio.dotenv.Dotenv;

import com.critix.config.EnvLoader;
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

    private EnvLoader envLoader = new EnvLoader();
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private String STRIPE_API = envLoader.getEnv("STRIPE_KEY", dotenv);

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) {
        System.out.println(STRIPE_API);
        String payload;
        try (Scanner scanner = new Scanner(request.getInputStream(), "UTF-8")) {
            payload = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
            System.out.println("GOING HERE 2");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error reading payload");
        }

        String sigHeader = request.getHeader("Stripe-Signature");
        Event event;
        System.out.println("GOING HERE 3");

        try {
            event = Webhook.constructEvent(payload, sigHeader, STRIPE_API);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        }
        System.out.println("GOING HERE 4");

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .map(obj -> (Session) obj)
                    .orElse(null);
            System.out.println("GOING HERE 5");

            if (session != null) {
                String userId = session.getClientReferenceId();
                System.out.println(session.getClientReferenceId());
                System.out.println("GOING HERE 6");
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