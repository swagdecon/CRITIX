package com.critix.controller;

import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import com.stripe.exception.SignatureVerificationException;

import com.critix.config.EnvLoader;
import com.critix.repository.UserRepository;
import com.critix.model.User;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Controller for handling Stripe payment webhooks and processing payment
 * events.
 * This controller specifically handles the checkout.session.completed event to
 * upgrade
 * users to ultimate status upon successful payment.
 */
@RestController
@RequestMapping("/api/stripe")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    // Stripe webhook event types
    private static final String CHECKOUT_SESSION_COMPLETED = "checkout.session.completed";

    @Autowired
    private UserRepository userRepository;

    private final EnvLoader envLoader;
    private final String stripeWebhookSecret;

    /**
     * Constructor initializes environment configuration and webhook secret.
     * Throws RuntimeException if required environment variables are missing.
     */
    public PaymentController() {
        this.envLoader = new EnvLoader();
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        try {
            this.stripeWebhookSecret = envLoader.getEnv("STRIPE_CREATE_SUBSCRIPTION_SECRET", dotenv);
            logger.info("PaymentController initialized successfully with webhook secret configured");
        } catch (RuntimeException e) {
            logger.error("Failed to initialize PaymentController: Missing required environment variable", e);
            throw e;
        }
    }

    /**
     * Handles Stripe webhook events, specifically processing successful checkout
     * sessions
     * to upgrade users to ultimate status.
     * 
     * @param request HTTP request containing the webhook payload and signature
     * @return ResponseEntity with success/error status
     */
    @PostMapping("/create-ultimate-subscription")
    public ResponseEntity<String> handleStripeWebhook(HttpServletRequest request) {
        logger.info("=== WEBHOOK RECEIVED ===");
        logger.info("Request method: {}", request.getMethod());
        logger.info("Request URI: {}", request.getRequestURI());
        logger.info("Content-Type: {}", request.getContentType());
        logger.info("User-Agent: {}", request.getHeader("User-Agent"));
        logger.info("Stripe-Signature header present: {}", request.getHeader("Stripe-Signature") != null);
        logger.info("Webhook secret configured: {}", stripeWebhookSecret != null && !stripeWebhookSecret.isEmpty());

        try {
            // Extract and validate payload
            String payload = extractPayload(request);
            logger.info("Payload length: {}", payload != null ? payload.length() : 0);
            logger.info("Payload preview: {}",
                    payload != null && payload.length() > 100 ? payload.substring(0, 100) + "..." : payload);

            if (payload == null || payload.isEmpty()) {
                logger.warn("Received empty webhook payload");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty payload");
            }

            // Extract and validate signature
            String signature = request.getHeader("Stripe-Signature");
            logger.info("Signature header: {}",
                    signature != null ? signature.substring(0, Math.min(50, signature.length())) + "..." : "null");

            if (signature == null || signature.isEmpty()) {
                logger.warn("Missing Stripe-Signature header");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing signature");
            }

            // Verify webhook signature and construct event
            Event event = verifyAndConstructEvent(payload, signature);
            logger.info("Successfully verified webhook signature for event type: {}", event.getType());
            logger.info("Event ID: {}", event.getId());

            // Process the event
            processWebhookEvent(event);

            logger.info("=== WEBHOOK PROCESSED SUCCESSFULLY ===");
            return ResponseEntity.ok("Webhook processed successfully");

        } catch (SignatureVerificationException e) {
            logger.error("Webhook signature verification failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid webhook payload", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payload");
        } catch (Exception e) {
            logger.error("Unexpected error processing webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    /**
     * Extracts the raw payload from the HTTP request.
     * 
     * @param request HTTP request
     * @return Raw payload string
     * @throws IOException if reading the request fails
     */
    private String extractPayload(HttpServletRequest request) throws IOException {
        try (Scanner scanner = new Scanner(request.getInputStream(), StandardCharsets.UTF_8.name())) {
            return scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
        }
    }

    /**
     * Verifies the webhook signature and constructs the Stripe event.
     * 
     * @param payload   Raw webhook payload
     * @param signature Stripe signature header
     * @return Verified Stripe event
     * @throws SignatureVerificationException if signature verification fails
     * @throws IllegalArgumentException       if payload is invalid
     */
    private Event verifyAndConstructEvent(String payload, String signature)
            throws SignatureVerificationException, IllegalArgumentException {
        try {
            return Webhook.constructEvent(payload, signature, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            logger.error("Signature verification failed for webhook", e);
            throw e;
        } catch (Exception e) {
            logger.error("Failed to construct Stripe event from payload", e);
            throw new IllegalArgumentException("Invalid webhook payload", e);
        }
    }

    /**
     * Processes the verified webhook event based on its type.
     * 
     * @param event Verified Stripe event
     */
    private void processWebhookEvent(Event event) {
        String eventType = event.getType();
        logger.info("Processing webhook event: {}", eventType);

        switch (eventType) {
            case CHECKOUT_SESSION_COMPLETED:
                handleCheckoutSessionCompleted(event);
                break;
            default:
                logger.info("Unhandled webhook event type: {}", eventType);
                break;
        }
    }

    /**
     * Handles the checkout.session.completed event to upgrade user to ultimate
     * status.
     * 
     * @param event Stripe checkout session completed event
     */
    @Transactional
    private void handleCheckoutSessionCompleted(Event event) {
        logger.info("Processing checkout session completed event");

        try {
            // Extract session data from event
            Session session = extractSessionFromEvent(event);
            if (session == null) {
                logger.warn("Failed to extract session from checkout.session.completed event");
                return;
            }

            // Get user ID from client reference
            String clientReferenceId = session.getClientReferenceId();

            if (clientReferenceId == null || clientReferenceId.trim().isEmpty()) {
                logger.warn("No client reference ID found in checkout session");
                return;
            }

            logger.info("Processing ultimate upgrade for user: {}", clientReferenceId);

            // Update user to ultimate status
            upgradeUserToUltimate(clientReferenceId);

        } catch (Exception e) {
            logger.error("Error processing checkout session completed event", e);
            throw new RuntimeException("Failed to process checkout session", e);
        }
    }

    /**
     * Extracts Session object from the Stripe event.
     * 
     * @param event Stripe event
     * @return Session object or null if extraction fails
     */
    private Session extractSessionFromEvent(Event event) {
        try {
            return event.getDataObjectDeserializer()
                    .getObject()
                    .map(obj -> (Session) obj)
                    .orElse(null);
        } catch (Exception e) {
            logger.error("Failed to extract session from event", e);
            return null;
        }
    }

    /**
     * Upgrades a user to ultimate status in the database.
     * 
     * @param userId ID of the user to upgrade
     */
    private void upgradeUserToUltimate(String clientReferenceId) {
        try {
            Optional<User> userOptional = userRepository.findById(clientReferenceId);

            if (userOptional.isEmpty()) {
                logger.warn("User not found for ID: {}", clientReferenceId);
                return;
            }

            User user = userOptional.get();

            // Check if user is already ultimate
            if (Boolean.TRUE.equals(user.getIsUltimateUser())) {
                logger.info("User {} is already an ultimate user", clientReferenceId);
                return;
            }

            // Update user to ultimate status
            user.setIsUltimateUser(true);
            user.setClientReferenceId(clientReferenceId);
            userRepository.save(user);

            logger.info("Successfully upgraded user {} to ultimate status", clientReferenceId);

        } catch (Exception e) {
            logger.error("Failed to upgrade user {} to ultimate status", clientReferenceId, e);
            throw new RuntimeException("Database update failed", e);
        }
    }

    /**
     * Health check endpoint to verify the webhook endpoint is accessible.
     * 
     * @return ResponseEntity with health status
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        logger.info("Health check requested for PaymentController");
        return ResponseEntity.ok("PaymentController is healthy");
    }

    /**
     * Test endpoint to verify webhook endpoint accessibility and configuration.
     * This endpoint can be used to test if the webhook URL is reachable.
     * 
     * @return ResponseEntity with test status and configuration info
     */
    @GetMapping("/test")
    public ResponseEntity<String> testWebhookEndpoint() {
        logger.info("Webhook test endpoint accessed");

        StringBuilder response = new StringBuilder();
        response.append("Webhook Endpoint Test\n");
        response.append("====================\n");
        response.append("Status: OK\n");
        response.append("Webhook Secret Configured: ")
                .append(stripeWebhookSecret != null && !stripeWebhookSecret.isEmpty()).append("\n");
        response.append("UserRepository Available: ").append(userRepository != null).append("\n");
        response.append("Timestamp: ").append(System.currentTimeMillis()).append("\n");

        return ResponseEntity.ok(response.toString());
    }

    /**
     * Simple POST test endpoint to verify POST requests work.
     * 
     * @param request HTTP request
     * @return ResponseEntity with test status
     */
    @PostMapping("/test-post")
    public ResponseEntity<String> testPostEndpoint(HttpServletRequest request) {
        logger.info("POST test endpoint accessed");
        logger.info("Request method: {}", request.getMethod());
        logger.info("Content-Type: {}", request.getContentType());

        return ResponseEntity.ok("POST endpoint is working - webhook should be accessible");
    }

    /**
     * Handles Stripe webhook events for subscription cancellations and endings.
     * Processes events to downgrade users from ultimate status when subscriptions
     * end.
     * 
     * @param request HTTP request containing the webhook payload and signature
     * @return ResponseEntity with success/error status
     */
    @PostMapping("/ultimate-subscription-ended")
    public ResponseEntity<String> handleSubscriptionEnded(HttpServletRequest request) {
        logger.info("=== SUBSCRIPTION ENDED WEBHOOK RECEIVED ===");
        logger.info("Request method: {}", request.getMethod());
        logger.info("Request URI: {}", request.getRequestURI());
        logger.info("Content-Type: {}", request.getContentType());
        logger.info("Stripe-Signature header present: {}", request.getHeader("Stripe-Signature") != null);

        try {
            // Extract and validate payload
            String payload = extractPayload(request);
            logger.info("Payload length: {}", payload != null ? payload.length() : 0);

            if (payload == null || payload.isEmpty()) {
                logger.warn("Received empty webhook payload");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty payload");
            }

            // Extract and validate signature
            String signature = request.getHeader("Stripe-Signature");
            if (signature == null || signature.isEmpty()) {
                logger.warn("Missing Stripe-Signature header");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing signature");
            }

            // Verify webhook signature and construct event
            Event event = verifyAndConstructEvent(payload, signature);
            logger.info("Successfully verified webhook signature for event type: {}", event.getType());
            logger.info("Event ID: {}", event.getId());

            // Process subscription ended events
            processSubscriptionEndedEvent(event);

            logger.info("=== SUBSCRIPTION ENDED WEBHOOK PROCESSED SUCCESSFULLY ===");
            return ResponseEntity.ok("Subscription ended webhook processed successfully");

        } catch (SignatureVerificationException e) {
            logger.error("Webhook signature verification failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid webhook payload", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payload");
        } catch (Exception e) {
            logger.error("Unexpected error processing subscription ended webhook", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }

    /**
     * Processes subscription ended webhook events based on their type.
     * Handles customer.subscription.deleted event for subscription termination.
     * 
     * @param event Verified Stripe event
     */
    private void processSubscriptionEndedEvent(Event event) {
        String eventType = event.getType();
        logger.info("Processing subscription ended event: {}", eventType);

        try {
            switch (eventType) {
                case "customer.subscription.deleted":
                    handleSubscriptionDeleted(event);
                    break;
                default:
                    logger.info("Unhandled subscription event type: {}", eventType);
                    break;
            }
        } catch (Exception e) {
            logger.error("Error processing subscription ended event type: {}", eventType, e);
            throw new RuntimeException("Failed to process subscription event", e);
        }
    }

    /**
     * Handles the customer.subscription.deleted event to downgrade user from
     * ultimate status.
     * This event fires when a subscription is cancelled or expires.
     * Uses clientReferenceId to identify the user.
     * 
     * @param event Stripe subscription deleted event
     */
    @Transactional
    private void handleSubscriptionDeleted(Event event) {
        logger.info("Processing subscription deleted event");

        try {
            // Extract subscription from event
            com.stripe.model.Subscription subscription = extractSubscriptionFromEvent(event);
            if (subscription == null) {
                logger.error("Failed to extract subscription from deleted event");
                throw new IllegalStateException("Could not extract subscription from event");
            }

            logger.info("Subscription ID: {}", subscription.getId());
            logger.info("Subscription status: {}", subscription.getStatus());

            // Get clientReferenceId from subscription metadata
            String clientReferenceId = subscription.getMetadata().get("client_reference_id");
            if (clientReferenceId == null || clientReferenceId.trim().isEmpty()) {
                logger.error("No client_reference_id found in subscription metadata");
                throw new IllegalStateException("Missing client_reference_id in subscription metadata");
            }

            logger.info("Processing subscription cancellation for clientReferenceId: {}", clientReferenceId);

            // Find user by clientReferenceId and downgrade
            downgradeUserByClientReferenceId(clientReferenceId, "Subscription deleted");

            logger.info("Successfully processed subscription deletion for clientReferenceId: {}", clientReferenceId);

        } catch (IllegalStateException e) {
            logger.error("Invalid state while processing subscription deleted event", e);
            throw new RuntimeException("Failed to process subscription deletion", e);
        } catch (Exception e) {
            logger.error("Unexpected error processing subscription deleted event", e);
            throw new RuntimeException("Failed to process subscription deletion", e);
        }
    }

    /**
     * Extracts Subscription object from the Stripe event.
     * 
     * @param event Stripe event
     * @return Subscription object or null if extraction fails
     */
    private com.stripe.model.Subscription extractSubscriptionFromEvent(Event event) {
        try {
            return event.getDataObjectDeserializer()
                    .getObject()
                    .map(obj -> (com.stripe.model.Subscription) obj)
                    .orElse(null);
        } catch (ClassCastException e) {
            logger.error("Failed to cast event object to Subscription", e);
            return null;
        } catch (Exception e) {
            logger.error("Failed to extract subscription from event", e);
            return null;
        }
    }

    /**
     * Finds a user by clientReferenceId and downgrades them from ultimate status.
     * 
     * @param clientReferenceId Client reference ID to find the user
     * @param reason            Reason for downgrade (for logging)
     */
    private void downgradeUserByClientReferenceId(String clientReferenceId, String reason) {
        try {
            Optional<User> userOptional = userRepository.findById(clientReferenceId);

            // Find user by clientReferenceId
            User user = userOptional.get();

            if (userOptional.isEmpty()) {
                logger.error("User not found for clientReferenceId: {}", clientReferenceId);
                throw new IllegalStateException("User not found for clientReferenceId: " + clientReferenceId);
            }

            logger.info("Found user with ID: {} for clientReferenceId: {}", user.getId(), clientReferenceId);

            // Check if user is currently ultimate
            if (Boolean.FALSE.equals(user.getIsUltimateUser())) {
                logger.info("User {} is already not an ultimate user", user.getId());
                return;
            }

            // Update user to remove ultimate status
            user.setIsUltimateUser(false);
            userRepository.save(user);

            logger.info("Successfully downgraded user {} from ultimate status. Reason: {}", user.getId(), reason);

        } catch (IllegalStateException e) {
            logger.error("Failed to find user with clientReferenceId: {}", clientReferenceId, e);
            throw e;
        } catch (Exception e) {
            logger.error("Failed to downgrade user with clientReferenceId: {}", clientReferenceId, e);
            throw new RuntimeException("Database update failed", e);
        }
    }
}