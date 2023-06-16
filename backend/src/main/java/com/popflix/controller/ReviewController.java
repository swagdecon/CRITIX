package com.popflix.controller;

import java.io.IOException;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.popflix.model.Movie;
import com.popflix.model.Review;
import com.popflix.service.ReviewService;
import com.popflix.service.tmdbRequests.Reviews;

import io.github.cdimascio.dotenv.Dotenv;
import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import org.springframework.web.bind.annotation.PostMapping;

@RequestMapping("/review")
public class ReviewController {
    ReviewService reviewService = new ReviewService();

    @PostMapping("/post/{movieId}/user/{userId}")

    public ResponseEntity<Optional<Review>> createMovieReview(@PathVariable Integer movieId, Integer userId,
            Integer reviewRating,
            String reviewContent) {
        return new ResponseEntity<Optional<Review>>(
                reviewService.createNewMovieReview(movieId, userId, reviewRating, reviewContent),
                HttpStatus.OK);
    }

    @GetMapping("/get/movie/{movieId}")
    public Response getReviews(Integer movieId) throws IOException {
        final OkHttpClient client = new OkHttpClient();
        Dotenv dotenv = Dotenv.load();
        String TMDB_API_KEY = dotenv.get("TMDB_API_KEY");
        Request request = new Request.Builder()
                .url("https://api.themoviedb.org/3/movie/" + movieId + "/reviews?language=en-US&page=1&api_key="
                        + TMDB_API_KEY)
                .get()
                .addHeader("Accept", "application/json")
                .build();

        Call call = client.newCall(request);
        return call.execute();
    }
}
