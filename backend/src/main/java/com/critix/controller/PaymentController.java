package com.critix.controller;

import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.net.Webhook;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.critix.auth.AuthenticationService;
import com.critix.config.EnvLoader;
import com.critix.repository.UserRepository;
import com.critix.model.User;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/stripe")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private static final String CHECKOUT_SESSION_COMPLETED = "checkout.session.completed";
    private static final String SUBSCRIPTION_DELETED = "customer.subscription.deleted";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationService authenticationService;

    private final EnvLoader envLoader;
    private final String stripeWebhookSecret;
    private final String stripeApiKey;

    public PaymentController() {
        this.envLoader = new EnvLoader();
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        try {
            this.stripeWebhookSecret = envLoader.getEnv("STRIPE_CREATE_SUBSCRIPTION_SECRET", dotenv);
            this.stripeApiKey = envLoader.getEnv("STRIPE_SECRET_KEY", dotenv);
            logger.info("PaymentController initialized successfully");
        } catch (RuntimeException e) {
            logger.error("Failed to initialize PaymentController: Missing required environment variable", e);
            throw e;
        }
    }

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
        logger.info("Stripe API key configured");
    }

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

    @GetMapping("/get-subscription-days-until-due")
    public ResponseEntity<?> handleSubscriptionDate(@RequestHeader("Authorization") String accessToken) {
        try {
            String subscriptionId = authenticationService.getUserDetails(accessToken).getStripeSubscriptionId();

            if (subscriptionId == null || subscriptionId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No active subscription found");
            }

            Subscription subscription = Subscription.retrieve(subscriptionId);

            // Get current_period_end from the first subscription item
            Long currentPeriodEnd = subscription.getItems().getData().get(0).getCurrentPeriodEnd();

            if (currentPeriodEnd == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Subscription renewal date not available");
            }

            LocalDateTime renewalDate = LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(currentPeriodEnd),
                    ZoneId.systemDefault());

            return ResponseEntity.ok(renewalDate);

        } catch (StripeException e) {
            logger.error("Stripe error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Unable to retrieve subscription");
        } catch (Exception e) {
            logger.error("Error retrieving subscription date", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred");
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
            case SUBSCRIPTION_DELETED:
                handleSubscriptionDeleted(event);
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
            // Parse the event's raw JSON to extract client_reference_id and subscription
            String eventJson = event.toJson();

            JsonObject json = JsonParser.parseString(eventJson).getAsJsonObject();
            JsonObject session = json.getAsJsonObject("data").getAsJsonObject("object");
            String clientReferenceId = null;

            if (session.has("client_reference_id") && !session.get("client_reference_id").isJsonNull()) {
                clientReferenceId = session.get("client_reference_id").getAsString();
            }

            String subscriptionId = null;
            if (session.has("subscription") && !session.get("subscription").isJsonNull()) {
                subscriptionId = session.get("subscription").getAsString();
            }

            if (clientReferenceId == null || clientReferenceId.trim().isEmpty()) {
                logger.warn("No client reference ID found in checkout session");
                return;
            }

            if (subscriptionId == null || subscriptionId.trim().isEmpty()) {
                logger.warn("No subscription ID found in checkout session");
                return;
            }

            // Get subscription details from Stripe to retrieve the start date
            Subscription subscription = Subscription.retrieve(subscriptionId);
            Long startTimestamp = subscription.getStartDate();
            LocalDateTime subscriptionStartDate = LocalDateTime.ofInstant(
                    Instant.ofEpochSecond(startTimestamp),
                    ZoneId.systemDefault());
            logger.info(
                    "Processing ultimate upgrade for user: {} with subscription: {} starting at {}, next billing: {}",
                    clientReferenceId, subscriptionId, subscriptionStartDate);
            upgradeUserToUltimate(clientReferenceId, subscriptionId, subscriptionStartDate);

        } catch (Exception e) {
            logger.error("Error processing checkout session completed event", e);
            throw new RuntimeException("Failed to process checkout session", e);
        }
    }

    /**
     * Upgrades a user to ultimate status in the database and saves their
     * subscription ID, start date, and next billing date.
     * 
     * @param clientReferenceId     ID of the user to upgrade
     * @param subscriptionId        Stripe subscription ID
     * @param subscriptionStartDate The date when the subscription started
     */
    private void upgradeUserToUltimate(String clientReferenceId, String subscriptionId,
            LocalDateTime subscriptionStartDate) {
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

            user.setIsUltimateUser(true);
            user.setStripeSubscriptionId(subscriptionId);
            user.setSubscriptionStartDate(subscriptionStartDate);
            userRepository.save(user);

            logger.info(
                    "Successfully upgraded user {} to ultimate status with subscription {} starting at {}, next billing: {}",
                    clientReferenceId, subscriptionId, subscriptionStartDate);

        } catch (Exception e) {
            logger.error("Failed to upgrade user {} to ultimate status", clientReferenceId, e);
            throw new RuntimeException("Database update failed", e);
        }
    }

    /**
     * Handles the customer.subscription.deleted event to remove ultimate status.
     * This is triggered when a subscription is cancelled and reaches the end of its
     * billing period.
     * 
     * @param event Stripe subscription deleted event
     */
    @Transactional
    private void handleSubscriptionDeleted(Event event) {
        logger.info("Processing subscription deleted event");

        try {
            // Parse the event's raw JSON to extract subscription ID
            String eventJson = event.toJson();

            JsonObject json = JsonParser.parseString(eventJson).getAsJsonObject();
            JsonObject subscription = json.getAsJsonObject("data").getAsJsonObject("object");

            String subscriptionId = null;
            if (subscription.has("id") && !subscription.get("id").isJsonNull()) {
                subscriptionId = subscription.get("id").getAsString();
            }

            if (subscriptionId == null || subscriptionId.trim().isEmpty()) {
                logger.warn("No subscription ID found in subscription deleted event");
                return;
            }

            logger.info("Processing subscription deletion for subscription: {}", subscriptionId);
            removeUltimateStatus(subscriptionId);

        } catch (Exception e) {
            logger.error("Error processing subscription deleted event", e);
            throw new RuntimeException("Failed to process subscription deletion", e);
        }
    }

    /**
     * Removes ultimate status from a user based on their subscription ID.
     * 
     * @param subscriptionId Stripe subscription ID
     */
    private void removeUltimateStatus(String subscriptionId) {
        try {
            Optional<User> userOptional = userRepository.findByStripeSubscriptionId(subscriptionId);

            if (userOptional.isEmpty()) {
                logger.warn("No user found with subscription ID: {}", subscriptionId);
                return;
            }

            User user = userOptional.get();

            // Update user to remove ultimate status
            user.setIsUltimateUser(false);
            user.setStripeSubscriptionId(null);
            user.setSubscriptionStartDate(null);
            userRepository.save(user);

            logger.info("Successfully removed ultimate status from user {} (subscription: {})",
                    user.getId(), subscriptionId);

        } catch (Exception e) {
            logger.error("Failed to remove ultimate status for subscription {}", subscriptionId, e);
            throw new RuntimeException("Database update failed", e);
        }
    }

    @PostMapping("/ultimate-subscription-ended")
    public ResponseEntity<String> handleSubscriptionEnded(@RequestHeader("Authorization") String accessToken) {
        logger.info("=== SUBSCRIPTION ENDED REQUEST RECEIVED ===");

        try {
            String userId = authenticationService.getUserDetails(accessToken).getId();
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            User user = userOptional.get();
            String subscriptionId = user.getStripeSubscriptionId();

            if (subscriptionId == null || subscriptionId.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No active subscription");
            }

            // Cancel subscription at period end in Stripe
            Subscription subscription = Subscription.retrieve(subscriptionId);
            Map<String, Object> params = new HashMap<>();
            params.put("cancel_at_period_end", true);
            subscription.update(params);

            logger.info("Subscription {} scheduled for cancellation at period end", subscriptionId);
            logger.info("=== SUBSCRIPTION CANCELLATION SCHEDULED ===");
            return ResponseEntity.ok("Subscription will be cancelled at the end of the billing period");

        } catch (Exception e) {
            logger.error("Error cancelling subscription", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error cancelling subscription");
        }
    }
}