package com.popflix.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.popflix.model.Movie;
import com.popflix.model.Person;
import com.popflix.repository.MovieRepository;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.Genre;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.ProductionCompany;
import info.movito.themoviedbapi.model.Reviews;
import info.movito.themoviedbapi.model.Video;
import info.movito.themoviedbapi.model.people.PersonCast;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Service
public class MovieService {
  static Dotenv dotenv = Dotenv.load();
  private String TMDB_API_KEY = dotenv.get("TMDB_API_KEY");
  private final MovieRepository movieRepository;
  private final MongoTemplate mongoTemplate;
  private final TmdbApi tmdbApi;
  String movieUrl = "https://image.tmdb.org/t/p/original";

  private HashMap<Integer, String> movieGenres;

  private ScheduledExecutorService executor;

  public MovieService(MovieRepository movieRepository, MongoTemplate mongoTemplate) {
    this.movieRepository = movieRepository;
    this.mongoTemplate = mongoTemplate;
    this.tmdbApi = new TmdbApi(TMDB_API_KEY);
    this.movieGenres = createMovieGenresMap();

  }

  public Optional<Movie> findMovieById(Integer id) {
    return movieRepository.findMovieById(id);
  }

  public List<Movie> allMovies(String collectionName) {
    Query query = new Query();
    return mongoTemplate.find(query, Movie.class, collectionName);
  }

  public Optional<Movie> singleMovie(Integer id, String collectionName) {
    Query query = new Query();
    query.addCriteria(Criteria.where("id").is(id));
    return Optional.ofNullable(mongoTemplate.findOne(query, Movie.class, collectionName));
  }

  public Optional<Movie> singleTmdbMovie(Integer id) {
    Movie movie = new Movie();
    movie.setId(id);
    MovieDb movieDb = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");
    String posterUrl = movieUrl + movieDb.getPosterPath();
    String backdropUrl = movieUrl + movieDb.getBackdropPath();
    movie.setAdult(movieDb.isAdult());
    movie.setTitle(movieDb.getOriginalTitle());
    movie.setOriginalLanguage(movieDb.getOriginalLanguage());
    movie.setOverview(movieDb.getOverview());
    movie.setPopularity(movieDb.getPopularity());
    movie.setPosterUrl(posterUrl);
    movie.setBackdropUrl(backdropUrl);
    movie.setImdbId(movieDb.getImdbID());
    movie.setReleaseDate(movieDb.getReleaseDate());
    movie.setTrailer(movie.getTrailer());
    movie.setVoteAverage(movie.getVoteAverage());
    movie.setVoteCount(movie.getVoteCount());
    updateTmdbMovieDetails(movie);
    return Optional.of(movie);
  }

  @PostConstruct
  public void init() {
    executor = Executors.newScheduledThreadPool(1);
    executor.scheduleAtFixedRate(this::updateMovies, 0, 24, TimeUnit.HOURS);
  }

  public void shutdown() {
    executor.shutdown();
  }

  public void updateMovies() {
    CompletableFuture<Void> nowPlayingFuture = saveMovieDetails("now_playing");
    CompletableFuture<Void> popularFuture = saveMovieDetails("popular");
    CompletableFuture<Void> topRatedFuture = saveMovieDetails("top_rated");
    CompletableFuture<Void> upcomingFuture = saveMovieDetails("upcoming_movies");

    try {
      CompletableFuture.allOf(nowPlayingFuture, popularFuture, topRatedFuture, upcomingFuture).get();
    } catch (InterruptedException | ExecutionException e) {
      System.out.println(e);
    }

    CompletableFuture<Void> updateNowPlayingFuture = updateMovieDetails("now_playing");
    CompletableFuture<Void> updatePopularFuture = updateMovieDetails("popular");
    CompletableFuture<Void> updateTopRatedFuture = updateMovieDetails("top_rated");
    CompletableFuture<Void> updateUpcomingFuture = updateMovieDetails("upcoming_movies");

    try {
      CompletableFuture.allOf(updateNowPlayingFuture, updatePopularFuture, updateTopRatedFuture, updateUpcomingFuture)
          .get();
    } catch (InterruptedException | ExecutionException e) {
      System.out.println(e);
    }
  }

  public CompletableFuture<Void> updateMovieDetails(String collectionName) {
    return CompletableFuture.runAsync(() -> {
      List<Movie> movies = allMovies(collectionName);
      for (Movie movie : movies) {
        MovieDb movieDb = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");

        // Initialize fields if they don't exist
        if (movie.getBudget() == null) {
          movie.setBudget(movieDb.getBudget());
        }
        if (movie.getTagline() == null) {
          movie.setTagline(movieDb.getTagline());
        }
        if (movie.getRevenue() == null) {
          movie.setRevenue(movieDb.getRevenue());
        }
        if (movie.getRuntime() == null) {
          movie.setRuntime(movieDb.getRuntime());
        }
        if (movie.getGenres() == null || movie.getGenres().isEmpty()) {
          // Get the movie genres
          List<Genre> genres = movieDb.getGenres();

          // Extract the movie genre names
          List<String> genreNames = new ArrayList<>();
          for (Genre genre : genres) {
            genreNames.add(genre.getName());
          }
          movie.setGenres(genreNames);
        }

        if (movie.getActors() == null || movie.getActors().isEmpty() ||
            movie.getActorImagePaths() == null || movie.getActorImagePaths().isEmpty()) {
          Credits movieCredits = tmdbApi.getMovies().getCredits(movie.getId());
          List<PersonCast> castList = movieCredits.getCast();
          List<Person> actors = new ArrayList<>();
          for (PersonCast cast : castList) {
            Person person = new Person();
            // This sets the Id of the person to the PersonId, not the CastId
            person.setId(cast.getId());
            person.setName(cast.getName());
            person.setProfilePath(cast.getProfilePath());
            actors.add(person);
          }
          movie.setActors(actors);
        }

        if (movie.getReviews() == null || movie.getReviews().isEmpty()) {
          List<Reviews> reviews = tmdbApi.getReviews().getReviews(movie.getId(), "en-US", 1).getResults();

          // Extract the review text for each review
          List<String> reviewTexts = new ArrayList<>();
          for (Reviews review : reviews) {
            String content = review.getContent();
            if (content.split("\\s+").length < 300 && !content.contains("SPOILER-FREE")
                && content.split("\\s+").length > 20) {
              reviewTexts.add(content);
            }
          }

          movie.setReviews(reviewTexts);
        }
        if (movie.getVoteAverage() == null) {
          Integer voteAverage = Math.round(movieDb.getVoteAverage() * 10);
          movie.setVoteAverage(Math.round(voteAverage));
        }
        if (movie.getVoteCount() == null) {
          Integer voteCount = movieDb.getVoteCount();
          movie.setVoteCount(voteCount);
        }

        if (movie.getImdbId() == null) {
          String imdbId = movieDb.getImdbID();
          movie.setImdbId(imdbId);
        }

        if (movie.getProductionCompanies() == null || movie.getProductionCompanies().isEmpty()) {
          // Get the movie production companies
          List<ProductionCompany> productionCompaniesList = movieDb.getProductionCompanies();

          // Extract the movie production company names
          List<String> productionCompanies = new ArrayList<>();
          for (ProductionCompany productionCompany : productionCompaniesList) {
            productionCompanies.add(productionCompany.getName());
          }
          movie.setProductionCompanies(productionCompanies);
        }

        if (movie.getMovieStatus() == null || movie.getMovieStatus().isEmpty()) {
          String movieStatus = tmdbApi.getMovies().getMovie(movie.getId(), "en-US").getStatus();
          movie.setMovieStatus(movieStatus);
        }

        if (movie.getTrailer() == null || movie.getTrailer().isEmpty()) {
          List<Video> movieVideos = tmdbApi.getMovies().getVideos(movie.getId(), "en-US");

          // Extract the video key for the main trailer
          String mainTrailerKey = null;
          for (Video video : movieVideos) {
            if (video.getType().equals("Trailer") && video.getSite().equals("YouTube")) {
              mainTrailerKey = video.getKey();
              break;
            }
          }

          if (mainTrailerKey != null) {
            movie.setTrailer("https://www.youtube.com/watch?v=" + mainTrailerKey);
          }
        }

        mongoTemplate.save(movie, collectionName);
      }
    });
  }

  public void updateTmdbMovieDetails(Movie movie) {
    MovieDb movieDb = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");

    movie.setBudget(movie.getBudget() != null ? movie.getBudget() : movieDb.getBudget());
    movie.setTagline(movie.getTagline() != null ? movie.getTagline() : movieDb.getTagline());
    movie.setRevenue(movie.getRevenue() != null ? movie.getRevenue() : movieDb.getRevenue());
    movie.setRuntime(movie.getRuntime() != null ? movie.getRuntime() : movieDb.getRuntime());
    movie.setVoteCount(movie.getVoteCount() != null ? movie.getVoteCount() : movieDb.getVoteCount());
    movie.setImdbId(movie.getImdbId() != null ? movie.getImdbId() : movieDb.getImdbID());
    movie.setVoteAverage(movie.getVoteAverage() != null ? Math.round(movie.getVoteAverage() * 10)
        : Math.round(movieDb.getVoteAverage() * 10));

    if (movie.getGenres() == null || movie.getGenres().isEmpty()) {
      // Get the movie genres
      List<Genre> genres = movieDb.getGenres();

      // Extract the movie genre names
      List<String> genreNames = new ArrayList<>();
      for (Genre genre : genres) {
        genreNames.add(genre.getName());
      }
      movie.setGenres(genreNames);
    }

    if (movie.getActors() == null || movie.getActors().isEmpty() ||
        movie.getActorImagePaths() == null || movie.getActorImagePaths().isEmpty()) {
      Credits movieCredits = tmdbApi.getMovies().getCredits(movie.getId());
      List<PersonCast> castList = movieCredits.getCast();
      List<Person> actors = new ArrayList<>();
      for (PersonCast cast : castList) {
        Person person = new Person();
        // This sets the Id of the person to the PersonId, not the CastId
        person.setId(cast.getId());
        person.setName(cast.getName());
        person.setProfilePath(cast.getProfilePath());
        actors.add(person);
      }
      movie.setActors(actors);
    }

    if (movie.getReviews() == null || movie.getReviews().isEmpty()) {
      List<Reviews> reviews = tmdbApi.getReviews().getReviews(movie.getId(),
          "en-US", 1).getResults();

      // Extract the review text for each review
      List<String> reviewTexts = new ArrayList<>();
      for (Reviews review : reviews) {
        String content = review.getContent();
        if (content.split("\\s+").length < 300 && !content.contains("SPOILER-FREE")
            && content.split("\\s+").length > 20) {
          reviewTexts.add(content);
        }
      }

      movie.setReviews(reviewTexts);
    }

    if (movie.getProductionCompanies() == null ||
        movie.getProductionCompanies().isEmpty()) {
      // Get the movie production companies
      List<ProductionCompany> productionCompaniesList = movieDb.getProductionCompanies();

      // Extract the movie production company names
      List<String> productionCompanies = new ArrayList<>();
      for (ProductionCompany productionCompany : productionCompaniesList) {
        productionCompanies.add(productionCompany.getName());
      }
      movie.setProductionCompanies(productionCompanies);
    }

    if (movie.getMovieStatus() == null || movie.getMovieStatus().isEmpty()) {
      String movieStatus = tmdbApi.getMovies().getMovie(movie.getId(),
          "en-US").getStatus();
      movie.setMovieStatus(movieStatus);
    }

    if (movie.getTrailer() == null || movie.getTrailer().isEmpty()) {
      List<Video> movieVideos = tmdbApi.getMovies().getVideos(movie.getId(),
          "en-US");

      // Extract the video key for the main trailer
      String mainTrailerKey = null;
      for (Video video : movieVideos) {
        if (video.getType().equals("Trailer") && video.getSite().equals("YouTube")) {
          mainTrailerKey = video.getKey();
          break;
        }
      }

      // Set the main trailer video key for the movie
      if (mainTrailerKey != null) {
        movie.setTrailer("https://www.youtube.com/watch?v=" + mainTrailerKey);
      }
    }
  }

  public CompletableFuture<Void> saveMovieDetails(String collectionName) {
    return CompletableFuture.runAsync(() -> {
      List<Movie> movies = new ArrayList<>();
      List<MovieDb> collection = null;
      mongoTemplate.dropCollection(collectionName);

      switch (collectionName) {
        case "now_playing":
          collection = tmdbApi.getMovies().getNowPlayingMovies("en-US", 1, "").getResults();
          break;
        case "popular":
          collection = tmdbApi.getMovies().getPopularMovies("en-US", 1).getResults();
          break;
        case "top_rated":
          collection = tmdbApi.getMovies().getTopRatedMovies("en-US", 1).getResults();
          break;
        case "upcoming_movies":
          collection = tmdbApi.getMovies().getUpcoming("en-US", 1, "").getResults();
          break;
        default:
          throw new IllegalArgumentException("Invalid method name: " + collectionName);
      }

      for (MovieDb movieDb : collection) {
        Movie movie = new Movie();
        String posterUrl = movieUrl + movieDb.getPosterPath();
        String backdropUrl = movieUrl + movieDb.getBackdropPath();
        movie.setId(movieDb.getId());
        movie.setAdult(movieDb.isAdult());
        movie.setTitle(movieDb.getOriginalTitle());
        movie.setOriginalLanguage(movieDb.getOriginalLanguage());
        movie.setOverview(movieDb.getOverview());
        movie.setPopularity(movieDb.getPopularity());
        movie.setPosterUrl(posterUrl);
        movie.setBackdropUrl(backdropUrl);
        movie.setReleaseDate(movieDb.getReleaseDate());
        movie.setTrailer(movie.getTrailer());
        movie.setVoteAverage(movie.getVoteAverage());
        movie.setVoteCount(movie.getVoteCount());
        movies.add(movie);
      }

      if (!movies.isEmpty()) {
        mongoTemplate.insert(movies, collectionName);
      }
    });
  }

  public List<Movie> searchResults(String query) throws IOException, InterruptedException, URISyntaxException {
    String url = "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_API_KEY + "&" + query;

    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(url))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

    if (response.statusCode() != 200) {
      return Collections.emptyList();
    }

    String responseBody = response.body();

    // Process the JSON response
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode rootNode = objectMapper.readTree(responseBody);
    ArrayNode resultsNode = (ArrayNode) rootNode.get("results");

    List<Movie> movies = new ArrayList<>();
    int count = Math.min(resultsNode.size(), 5);

    for (int i = 0; i < count; i++) {
      JsonNode movieNode = resultsNode.get(i);
      // Helper method to extract relevant movie details
      Movie movie = extractMovieInfoFromApi(movieNode);
      movies.add(movie);
    }

    return movies;
  }

  public HashMap<Integer, String> createMovieGenresMap() {
    HashMap<Integer, String> movieGenres = new HashMap<>();

    movieGenres.put(28, "Action");
    movieGenres.put(12, "Adventure");
    movieGenres.put(16, "Animation");
    movieGenres.put(35, "Comedy");
    movieGenres.put(80, "Crime");
    movieGenres.put(99, "Documentary");
    movieGenres.put(18, "Drama");
    movieGenres.put(10751, "Family");
    movieGenres.put(14, "Fantasy");
    movieGenres.put(36, "History");
    movieGenres.put(27, "Horror");
    movieGenres.put(10402, "Music");
    movieGenres.put(9648, "Mystery");
    movieGenres.put(10749, "Romance");
    movieGenres.put(878, "Science Fiction");
    movieGenres.put(10770, "TV Movie");
    movieGenres.put(53, "Thriller");
    movieGenres.put(10752, "War");
    movieGenres.put(37, "Western");

    return movieGenres;
  }

  private Movie extractMovieInfoFromApi(JsonNode movieNode) {
    Movie movie = new Movie();

    setIntPropertyIfExists(movie, movieNode, "id", Movie::setId);
    setStringPropertyIfExists(movie, movieNode, "title", Movie::setTitle);
    setIntPropertyIfExistsAndMultiply(movie, movieNode, "vote_average", 10, Movie::setVoteAverage);
    setStringPropertyIfExists(movie, movieNode, "poster_path", Movie::setPosterUrl);
    setStringPropertyIfExists(movie, movieNode, "release_date", Movie::setReleaseDate);
    setIntPropertyIfExists(movie, movieNode, "runtime", Movie::setRuntime);
    setGenresPropertyIfExists(movie, movieNode, "genre_ids");
    setStringPropertyIfExists(movie, movieNode, "overview", Movie::setOverview);
    setStringPropertyIfExists(movie, movieNode, "video", Movie::setTrailer);

    return movie;
  }

  private void setIntPropertyIfExistsAndMultiply(Movie movie, JsonNode node, String propertyName, int multiplier,
      BiConsumer<Movie, Integer> setter) {
    JsonNode propertyNode = node.get(propertyName);
    if (propertyNode != null && !propertyNode.isNull()) {
      setter.accept(movie, propertyNode.asInt() * multiplier);
    }
  }

  private void setIntPropertyIfExists(Movie movie, JsonNode node, String propertyName,
      BiConsumer<Movie, Integer> setter) {
    JsonNode propertyNode = node.get(propertyName);
    if (propertyNode != null && !propertyNode.isNull()) {
      setter.accept(movie, propertyNode.asInt());
    }
  }

  private void setStringPropertyIfExists(Movie movie, JsonNode node, String propertyName,
      BiConsumer<Movie, String> setter) {
    JsonNode propertyNode = node.get(propertyName);
    if (propertyNode != null && !propertyNode.isNull()) {
      setter.accept(movie, propertyNode.asText());
    }
  }

  private void setGenresPropertyIfExists(Movie movie, JsonNode node, String propertyName) {
    JsonNode genresNode = node.get(propertyName);
    if (genresNode != null && genresNode.isArray()) {
      HashMap<Integer, String> movieGenres = createMovieGenresMap();
      List<String> genresList = new ArrayList<>();
      for (JsonNode genre : genresNode) {
        if (genre.isInt()) {
          int genreId = genre.asInt();
          if (movieGenres.containsKey(genreId)) {
            genresList.add(movieGenres.get(genreId));
          }
        }
      }
      movie.setGenres(genresList);
    }
  }

  public List<Movie> recommendedMovies(Integer id, String options)
      throws IOException, InterruptedException, URISyntaxException {
    String url = "https://api.themoviedb.org/3/movie/" + id + "/recommendations?"
        + options + "&api_key=" + TMDB_API_KEY;
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(url))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() != 200) {

      return Collections.emptyList();
    }

    String responseBody = response.body();

    // Process the JSON response
    ObjectMapper objectMapper = new ObjectMapper();
    JsonNode rootNode = objectMapper.readTree(responseBody);
    ArrayNode resultsNode = (ArrayNode) rootNode.get("results");

    List<Movie> movies = new ArrayList<>();
    int count = Math.min(resultsNode.size(), 20);

    for (int i = 0; i < count; i++) {
      JsonNode movieNode = resultsNode.get(i);
      // Helper method to extract relevant movie details
      Movie movie = extractMovieInfoFromApi(movieNode);
      movies.add(movie);
    }
    return movies;
  }
}