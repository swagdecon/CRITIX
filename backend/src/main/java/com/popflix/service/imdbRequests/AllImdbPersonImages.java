package com.popflix.service.imdbRequests;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class AllImdbPersonImages {
    public List<String> imdbPersonImageRequest(String imdbId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://imdb8.p.rapidapi.com/actors/get-all-images?nconst=" + imdbId))
                .header("X-RapidAPI-Key", "349136b942msh6c632fc990fca08p1625c1jsn9838599cbe73")
                .header("X-RapidAPI-Host", "imdb8.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(response.body());
        List<String> images = new ArrayList<>();

        JsonNode imagesNode = rootNode.path("resource").path("images");
        int limit = 20;
        for (int i = 0; i < imagesNode.size() && i < limit; i++) {
            JsonNode imageNode = imagesNode.get(i);
            String imageUrl = imageNode.path("url").asText();
            images.add(imageUrl);
        }
        return images;
    }

}
