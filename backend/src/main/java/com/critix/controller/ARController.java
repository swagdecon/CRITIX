package com.critix.controller;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.critix.config.EnvLoader;
import io.github.cdimascio.dotenv.Dotenv;

@RestController
@RequestMapping("/ar")
public class ARController {

    private EnvLoader envLoader = new EnvLoader();
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
    private String SKETCHFAB_API_URL = envLoader.getEnv("SKETCHFAB_API_URL", dotenv);
    private String SKETCHFAB_API_KEY = envLoader.getEnv("SKETCHFAB_API_KEY", dotenv);

    @GetMapping("/search/{movieName}")
    public ResponseEntity<?> searchModel(@PathVariable String movieName) {
        try {
            String query = movieName + " movie";
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8.toString());
            System.out.println(query);

            String searchUrl = SKETCHFAB_API_URL + encodedQuery;

            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(searchUrl))
                    .setHeader("Authorization", SKETCHFAB_API_KEY)
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            String responseBody = response.body();
            JSONObject jsonResponse = new JSONObject(responseBody);

            if (!jsonResponse.has("results")) {
                return ResponseEntity.status(404).body("No models found.");
            }

            JSONArray results = jsonResponse.getJSONArray("results");

            if (results.length() > 0) {
                JSONObject firstModel = results.getJSONObject(0);

                if (!firstModel.has("embedUrl")) {
                    return ResponseEntity.status(404).body("Model found, but embedUrl is missing.");
                }

                String embedUrl = firstModel.getString("embedUrl");

                JSONObject result = new JSONObject();
                result.put("embedUrl", embedUrl);

                return ResponseEntity.ok(result.toString());
            } else {
                return ResponseEntity.status(404).body("No models found.");
            }
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

}
