package com.popflix.service.tmdbRequests;

import okhttp3.Call;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

import java.io.IOException;

import io.github.cdimascio.dotenv.Dotenv;

public class Reviews {
    // private final OkHttpClient client = new OkHttpClient();
    // Dotenv dotenv = Dotenv.load();
    // private String TMDB_API_KEY = dotenv.get("TMDB_API_KEY");

    // public Response getReviews(Integer movieId) throws IOException {
    // Request request = new Request.Builder()
    // .url("https://api.themoviedb.org/3/movie/" + movieId +
    // "/reviews?language=en-US&page=1&api_key="
    // + TMDB_API_KEY)
    // .get()
    // .addHeader("accept", "application/json")
    // .build();

    // Call call = client.newCall(request);
    // return call.execute();
    // }
}
