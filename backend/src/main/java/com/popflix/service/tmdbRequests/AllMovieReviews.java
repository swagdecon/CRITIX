package com.popflix.service.tmdbRequests;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class AllMovieReviews {
    public HttpResponse<String> getMovieReviews(Integer movieId)
            throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.themoviedb.org/3/movie/movie_id/reviews?language=en-US&page=1"))
                .header("accept", "application/json")
                .header("Authorization", "Bearer 7db76e8e9034b256268fa9c7ad16f8c3")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
        return response;

    }
}
