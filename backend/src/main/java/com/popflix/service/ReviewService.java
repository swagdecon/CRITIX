package com.popflix.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.popflix.model.Review;

@Service
public class ReviewService {
    public List<String> getAllValidReviews(String movieId) throws java.io.IOException, InterruptedException {
        Review review = new Review();
        List<String> jobs = allPersonJobs.imdbPersonJobs(imdbId);
        jobs.remove("miscellaneous");
        jobs.remove("soundtrack");

        return jobs;
    }
}
