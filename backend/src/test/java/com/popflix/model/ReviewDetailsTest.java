package com.popflix.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReviewDetailsTest {

    @Test
    void testReviewDetails() {
        // Create a ReviewDetails object
        ReviewDetails reviewDetails = new ReviewDetails();
        reviewDetails.setContent("This movie is amazing!");
        reviewDetails.setAuthorName("John Doe");
        reviewDetails.setAuthorUsername("johndoe123");
        reviewDetails.setAuthorAvatarPath("/avatar.jpg");

        // Perform assertions
        assertEquals("This movie is amazing!", reviewDetails.getContent());
        assertEquals("John Doe", reviewDetails.getAuthorName());
        assertEquals("johndoe123", reviewDetails.getAuthorUsername());
        assertEquals("/avatar.jpg", reviewDetails.getAuthorAvatarPath());
    }
}
