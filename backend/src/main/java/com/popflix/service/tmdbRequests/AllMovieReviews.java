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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.model.Review;

import io.github.cdimascio.dotenv.Dotenv;

public class AllMovieReviews {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<Integer, List<Review>> reviewCache = new HashMap<>();

    public List<Review> getMovieReviews(Integer movieId)
            throws IOException, InterruptedException {
        if (reviewCache.containsKey(movieId)) {
            return reviewCache.get(movieId);
        }
        Dotenv dotenv = Dotenv.load();
        String TMDB_API_KEY = dotenv.get("TMDB_API_KEY");

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(
                        "https://api.themoviedb.org/3/movie/" + movieId
                                + "/reviews?language=en-US&page=1&api_key=" + TMDB_API_KEY))
                .header("accept", "application/json")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request,
                HttpResponse.BodyHandlers.ofString());
        List<Review> reviews = parseMovieReviews(response.body());

        reviewCache.put(movieId, reviews);
        return reviews;
    }

    private List<Review> parseMovieReviews(String responseBody) throws IOException {
        List<Review> reviews = new ArrayList<>();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        JsonNode resultsNode = jsonNode.path("results");
        if (resultsNode.isArray()) {
            for (JsonNode resultNode : resultsNode) {
                String content = resultNode.path("content").asText();
                if (!content.contains("http") && !content.contains("https")) {
                    Review review = new Review();
                    review.setAuthor(resultNode.path("author").asText());
                    JsonNode authorDetailsNode = resultNode.path("author_details");
                    if (authorDetailsNode.has("avatar_path")) {
                        String avatarPath = authorDetailsNode.path("avatar_path").asText();
                        if (avatarPath.contains("secure.gravatar.com")) {
                            String avatarPathWithoutSlash = avatarPath.substring(1);
                            review.setAvatar(avatarPathWithoutSlash);
                        } else {
                            review.setAvatar(avatarPath);
                        }
                    }
                    review.setContent(content);
                    if (authorDetailsNode.has("rating")) {
                        review.setRating(authorDetailsNode.path("rating").asText());
                    }
                    String timestamp = resultNode.path("created_at").asText();
                    LocalDateTime dateTime = LocalDateTime.parse(timestamp, DateTimeFormatter.ISO_DATE_TIME);
                    review.setCreatedDate(dateTime.toLocalDate().toString());
                    review.setUpdatedDate(resultNode.path("updated_at").asText());
                    reviews.add(review);
                }
            }
        }
        return reviews;
    }
}
