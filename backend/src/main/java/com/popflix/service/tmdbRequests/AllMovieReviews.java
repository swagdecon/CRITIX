package com.popflix.service.tmdbRequests;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.model.Review;

public class AllMovieReviews {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<Integer, List<Review>> reviewCache = new HashMap<>();

    public List<Review> getMovieReviews(Integer movieId)
            throws IOException, InterruptedException {
        if (reviewCache.containsKey(movieId)) {
            return reviewCache.get(movieId);
        }

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(
                        "https://api.themoviedb.org/3/movie/" + movieId
                                + "/reviews?language=en-US&page=1&api_key=106a378e128c7b7d4af58c04580ca64e"))
                .header("accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request,
                HttpResponse.BodyHandlers.ofString());
        List<Review> reviews = parseMovieReviews(response.body());

        reviewCache.put(movieId, reviews);

        System.out.println(response.body());

        return reviews;
    }

    private List<Review> parseMovieReviews(String responseBody) throws IOException {
        List<Review> reviews = new ArrayList<>();

        JsonNode jsonNode = objectMapper.readTree(responseBody);
        if (jsonNode.has("results") && jsonNode.get("results").isArray()) {
            JsonNode resultsNode = jsonNode.get("results");
            for (JsonNode resultNode : resultsNode) {
                Review review = new Review();
                if (resultNode.has("author")) {
                    review.setAuthor(resultNode.get("author").asText());
                }
                if (resultNode.has("author_details") && resultNode.get("author_details").has("avatar_path")) {
                    review.setAvatar(resultNode.get("author_details").get("avatar_path").asText());
                }
                if (resultNode.has("content")) {
                    review.setContent(resultNode.get("content").asText());
                }
                if (resultNode.has("author_details") && resultNode.get("author_details").has("rating")) {
                    review.setRating(resultNode.get("author_details").get("rating").asText());
                }
                if (resultNode.has("created_at")) {
                    review.setCreatedDate(resultNode.get("created_at").asText());
                }
                if (resultNode.has("updated_at")) {
                    review.setUpdatedDate(resultNode.get("updated_at").asText());
                }
                reviews.add(review);
            }
        }

        return reviews;
    }
}
