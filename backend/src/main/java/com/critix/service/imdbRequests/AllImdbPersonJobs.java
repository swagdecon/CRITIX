package com.critix.service.imdbRequests;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

public class AllImdbPersonJobs {
    public List<String> imdbPersonJobs(String imdbId) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://imdb8.p.rapidapi.com/actors/get-interesting-jobs?nconst=" + imdbId))
                .header("X-RapidAPI-Key", "349136b942msh6c632fc990fca08p1625c1jsn9838599cbe73")
                .header("X-RapidAPI-Host", "imdb8.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(response.body());
        List<String> jobs = new ArrayList<>();

        for (int i = 0; i < rootNode.size() && i < 5; i++) {
            JsonNode imageNode = rootNode.get(i);
            String personJobs = imageNode.asText();
            jobs.add(personJobs);
        }
        return jobs;
    }
}
