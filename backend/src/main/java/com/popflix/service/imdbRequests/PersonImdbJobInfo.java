package com.popflix.service.imdbRequests;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class PersonImdbJobInfo {
    public Integer personFilmAppearances(String imdbId) throws IOException, InterruptedException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst=" + imdbId))
                .header("X-RapidAPI-Key", "349136b942msh6c632fc990fca08p1625c1jsn9838599cbe73")
                .header("X-RapidAPI-Host", "imdb8.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode filmographyNode = rootNode.get("filmography");

        int count = 0;
        for (JsonNode node : filmographyNode) {
            JsonNode categoryNode = node.get("category");
            if (categoryNode != null && categoryNode.asText().equals("actor")) {
                count++;
            }
        }
        return count;
    }

    public Integer personMoviesProduced(String imdbId) throws IOException, InterruptedException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://imdb8.p.rapidapi.com/actors/get-all-filmography?nconst=" + imdbId))
                .header("X-RapidAPI-Key", "349136b942msh6c632fc990fca08p1625c1jsn9838599cbe73")
                .header("X-RapidAPI-Host", "imdb8.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response.body());
        JsonNode filmographyNode = rootNode.get("filmography");

        int count = 0;
        for (JsonNode node : filmographyNode) {
            JsonNode categoryNode = node.get("category");
            if (categoryNode != null && categoryNode.asText().equals("actor")) {
                count++;
            }
        }
        return count;
    }
}