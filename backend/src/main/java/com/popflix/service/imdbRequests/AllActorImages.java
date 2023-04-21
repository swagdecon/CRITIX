package com.popflix.service.imdbRequests;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class AllActorImages {
    public String imdbActorImageRequest(String imdbId) throws IOException, InterruptedException {

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://imdb8.p.rapidapi.com/actors/get-all-images?nconst=" +
                        imdbId + "&limit=20"))
                .header("X-RapidAPI-Key", "349136b942msh6c632fc990fca08p1625c1jsn9838599cbe73")
                .header("X-RapidAPI-Host", "imdb8.p.rapidapi.com")
                .method("GET", HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        System.out.println(response.body());
        return response.body();

    }

}
