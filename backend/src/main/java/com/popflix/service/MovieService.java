package com.popflix.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.model.Movie;
import com.popflix.model.MovieCard;
import com.popflix.model.MovieResults;
import com.popflix.model.Person;
import com.popflix.model.User;
import com.popflix.repository.MovieRepository;
import com.popflix.repository.UserRepository;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.Genre;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.ProductionCompany;
import info.movito.themoviedbapi.model.Reviews;
import info.movito.themoviedbapi.model.Video;
import info.movito.themoviedbapi.model.people.PersonCast;
import info.movito.themoviedbapi.model.providers.ProviderResults;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Service
public class MovieService {
  static Dotenv dotenv = Dotenv.load();
  private String TMDB_API_KEY = dotenv.get("TMDB_API_KEY");
  private String YT_URL_PREFIX = dotenv.get("YT_URL_PREFIX");
  private String TMDB_IMAGE_PREFIX = dotenv.get("TMDB_IMAGE_PREFIX");

  private final MovieRepository movieRepository;
  private final MongoTemplate mongoTemplate;
  @Autowired
  private UserRepository userRepository;
  private final TmdbApi tmdbApi = new TmdbApi(TMDB_API_KEY);
  private ScheduledExecutorService executor;

  public MovieService(MovieRepository movieRepository, MongoTemplate mongoTemplate) {
    this.movieRepository = movieRepository;
    this.mongoTemplate = mongoTemplate;
  }

  @PostConstruct
  public void init() {
    try {
      executor = Executors.newScheduledThreadPool(1);
      executor.scheduleAtFixedRate(this::saveTopMovies, 0, 24, TimeUnit.HOURS);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void shutdown() {
    executor.shutdown();
  }

  public void saveTopMovies() {
    CompletableFuture<Void> nowPlayingFuture = saveTop20ListDetails("now_playing");
    CompletableFuture<Void> popularFuture = saveTop20ListDetails("popular");
    CompletableFuture<Void> topRatedFuture = saveTop20ListDetails("top_rated");
    CompletableFuture<Void> upcomingFuture = saveTop20ListDetails("upcoming_movies");

    try {
      CompletableFuture.allOf(nowPlayingFuture, popularFuture,
          topRatedFuture, upcomingFuture).get();
    } catch (InterruptedException | ExecutionException e) {
      System.out.println(e);
    }
  }

  public Optional<Movie> allMovies(Integer id) {
    return movieRepository.findMovieById(id);
  }

  public List<Movie> getTop20MoviesForUser(String collectionName, String userId) {
    Query query = new Query();
    List<Movie> movies = mongoTemplate.find(query, Movie.class, collectionName);

    for (Movie movie : movies) {
      boolean watchListMovieAlreadyExists = userRepository.doesMovieExist(userId, movie.getId());
      movie.setIsSavedToWatchlist(watchListMovieAlreadyExists);
    }

    return movies;
  }

  public List<Movie> getTop20Movies(String collectionName) {
    Query query = new Query();
    return mongoTemplate.find(query, Movie.class, collectionName);
  }

  public Optional<Movie> singleMovie(Integer movieId, String collectionName, String userId) {
    Query query = new Query();
    query.addCriteria(Criteria.where("id").is(movieId));

    Movie movie = mongoTemplate.findOne(query, Movie.class, collectionName);
    if (movie != null) {
      boolean watchListMovieAlreadyExists = userRepository.doesMovieExist(userId, movieId);
      movie.setIsSavedToWatchlist(watchListMovieAlreadyExists);
      return Optional.of(movie);
    } else {
      return Optional.empty();
    }
  }

  private void setMovieDetails(Movie movie, MovieDb movieApi) {

    String posterUrl = TMDB_IMAGE_PREFIX + movieApi.getPosterPath();
    String backdropUrl = TMDB_IMAGE_PREFIX + movieApi.getBackdropPath();
    movie.setTitle(movieApi.getTitle());
    movie.setOriginalLanguage(movieApi.getOriginalLanguage());
    movie.setOverview(movieApi.getOverview());
    movie.setPopularity(movieApi.getPopularity());
    movie.setPosterUrl(posterUrl);
    movie.setBackdropUrl(backdropUrl);
    movie.setImdbId(movieApi.getImdbID());
    movie.setReleaseDate(movieApi.getReleaseDate());
    movie.setBudget(movieApi.getBudget());
    movie.setTagline(movieApi.getTagline());
    movie.setRevenue(movieApi.getRevenue());
    movie.setRuntime(movieApi.getRuntime());
    movie.setVoteCount(movieApi.getVoteCount());
    movie.setProviderResults(movieApi.getWatchProviders());
    // Complex fields which require functions to parse api data
    setVoteAverage(movie, movieApi);
    setGenres(movie, movieApi);
    setActors(movie, movieApi);
    setReviews(movie, movieApi);
    setProductionCompanies(movie, movieApi);
    setMovieStatus(movie, movieApi);
    setTrailer(movie, movieApi);
  }

  public Optional<Movie> singleTmdbMovie(Integer movieId, String userId)
      throws IOException, InterruptedException, URISyntaxException {

    boolean watchListMovieAlreadyExists = userRepository.doesMovieExist(userId, movieId);
    MovieDb movieApi = tmdbApi.getMovies().getMovie(movieId, "en-US");

    Movie movie = new Movie();
    movie.setId(movieId);
    setProviderResults(movie, movieId);
    movie.setIsSavedToWatchlist(watchListMovieAlreadyExists);
    setMovieDetails(movie, movieApi);

    return Optional.of(movie);
  }

  private void setVoteAverage(Movie movie, MovieDb movieApi) {
    if (movie.getVoteAverage() == null) {
      movie.setVoteAverage(Math.round(movieApi.getVoteAverage() * 10));
    }
  }

  private void setProviderResults(Movie movie, Integer movieId)
      throws IOException, InterruptedException, URISyntaxException {
    String url = "https://api.themoviedb.org/3/movie/" + movieId + "/watch/providers" + "?" +
        "api_key=" + TMDB_API_KEY;

    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(url))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request,
        HttpResponse.BodyHandlers.ofString());
    String responseBody = response.body();
    System.out.println(responseBody);
  }

  private void setGenres(Movie movie, MovieDb movieApi) {
    if (movie.getGenres() == null || movie.getGenres().isEmpty()) {
      // Get the movie genres
      List<Genre> genres = movieApi.getGenres();
      if (genres != null) {
        // Extract the movie genre names
        List<String> genreNames = new ArrayList<>();
        for (Genre genre : genres) {
          genreNames.add(genre.getName());
        }
        movie.setGenres(genreNames);
      }
    }
  }

  private void setActors(Movie movie, MovieDb movieApi) {
    if (movie.getActors() == null || movie.getActors().isEmpty()) {
      Credits movieCredits = tmdbApi.getMovies().getCredits(movie.getId());
      List<PersonCast> castList = movieCredits.getCast();
      List<Person> actors = new ArrayList<>();
      for (PersonCast cast : castList) {
        Person person = new Person();
        person.setId(cast.getId());
        person.setName(cast.getName());
        person.setProfilePath(cast.getProfilePath());
        actors.add(person);
      }
      movie.setActors(actors);
    }
  }

  private void setReviews(Movie movie, MovieDb movieApi) {
    if (movie.getReviews() == null || movie.getReviews().isEmpty()) {
      List<Reviews> reviews = tmdbApi.getReviews().getReviews(movie.getId(), "en-US", 1).getResults();
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
  }

  private void setProductionCompanies(Movie movie, MovieDb movieApi) {
    if (movie.getProductionCompanies() == null || movie.getProductionCompanies().isEmpty()) {
      List<ProductionCompany> productionCompaniesList = movieApi.getProductionCompanies();
      List<String> productionCompanies = new ArrayList<>();
      for (ProductionCompany productionCompany : productionCompaniesList) {
        productionCompanies.add(productionCompany.getName());
      }
      movie.setProductionCompanies(productionCompanies);
    }
  }

  private void setMovieStatus(Movie movie, MovieDb movieApi) {
    if (movie.getMovieStatus() == null || movie.getMovieStatus().isEmpty()) {
      String movieStatus = tmdbApi.getMovies().getMovie(movie.getId(), "en-US").getStatus();
      movie.setMovieStatus(movieStatus);
    }
  }

  private void setTrailer(Movie movie, MovieDb movieApi) {
    if (movie.getTrailer() == null || movie.getTrailer().isEmpty()) {
      List<Video> movieVideos = tmdbApi.getMovies().getVideos(movie.getId(), "en-US");
      String mainTrailerKey = null;
      for (Video video : movieVideos) {
        if (video.getType().equals("Trailer") && video.getSite().equals("YouTube")) {
          mainTrailerKey = video.getKey();
          break;
        }
      }
      if (mainTrailerKey != null) {
        movie.setTrailer(YT_URL_PREFIX + mainTrailerKey);
      }
    }
  }

  public CompletableFuture<Void> saveTop20ListDetails(String collectionName) {
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

        String posterUrl = TMDB_IMAGE_PREFIX + movieDb.getPosterPath();
        String backdropUrl = TMDB_IMAGE_PREFIX + movieDb.getBackdropPath();
        movie.setId(movieDb.getId());
        movie.setTitle(movieDb.getTitle());
        movie.setOriginalLanguage(movieDb.getOriginalLanguage());
        movie.setOverview(movieDb.getOverview());
        movie.setPopularity(movieDb.getPopularity());
        movie.setPosterUrl(posterUrl);
        movie.setBackdropUrl(backdropUrl);
        movie.setReleaseDate(movieDb.getReleaseDate());
        setVoteAverage(movie, movieDb);
        updateMovieDbDetails(collectionName);
        movies.add(movie);
      }

      if (!movies.isEmpty()) {
        mongoTemplate.insert(movies, collectionName);
      }
    });
  }

  public CompletableFuture<Void> updateMovieDbDetails(String collectionName) {
    return CompletableFuture.runAsync(() -> {
      List<Movie> movies = getTop20Movies(collectionName);
      for (Movie movie : movies) {
        MovieDb movieDb = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");

        if (movie.getTagline() == null) {
          movie.setTagline(movieDb.getTagline());
        }
        if (movie.getVoteAverage() == null) {
          Integer voteAverage = Math.round(movieDb.getVoteAverage() * 10);
          movie.setVoteAverage(Math.round(voteAverage));
        }
        if (movie.getVoteCount() == null) {
          Integer voteCount = movieDb.getVoteCount();
          movie.setVoteCount(voteCount);
        }
        if (movie.getBudget() == null) {
          movie.setBudget(movieDb.getBudget());
        }
        if (movie.getRevenue() == null) {
          movie.setRevenue(movieDb.getRevenue());
        }
        if (movie.getRuntime() == null) {
          movie.setRuntime(movieDb.getRuntime());
        }
        if (movie.getImdbId() == null) {
          String imdbId = movieDb.getImdbID();
          movie.setImdbId(imdbId);
        }
        if (movie.getProviderResults() == null) {
          ProviderResults watchProvider = movieDb.getWatchProviders();
          movie.setProviderResults(watchProvider);
        }

        setGenres(movie, movieDb);
        setActors(movie, movieDb);
        setReviews(movie, movieDb);
        setProductionCompanies(movie, movieDb);
        setMovieStatus(movie, movieDb);
        setTrailer(movie, movieDb);

        mongoTemplate.save(movie, collectionName);
      }
    });
  }

  // public MovieResults getMovieResults(String endpoint, Integer page) {

  // MovieResultsPage results;
  // Integer totalPages;
  // List<MovieDb> movieResults;

  // switch (endpoint) {
  // case "now_playing":
  // results = tmdbApi.getMovies().getNowPlayingMovies("en-US", page, "");
  // movieResults = results.getResults();
  // totalPages = results.getTotalPages();
  // break;
  // case "popular":
  // results = tmdbApi.getMovies().getPopularMovies("en-US", page);
  // movieResults = results.getResults();
  // totalPages = results.getTotalPages();
  // break;
  // case "top_rated":
  // results = tmdbApi.getMovies().getTopRatedMovies("en-US", page);
  // movieResults = results.getResults();
  // totalPages = results.getTotalPages();
  // break;
  // case "upcoming":
  // results = tmdbApi.getMovies().getUpcoming("en-US", page, "");
  // movieResults = results.getResults();
  // totalPages = results.getTotalPages();
  // break;
  // default:
  // throw new IllegalArgumentException("Invalid method name: " + endpoint);
  // }

  // List<MovieDb> updatedMoviesResults = movieResults.stream().peek(movie -> {
  // movie.setTitle(movie.getTitle());
  // movie.setOverview(movie.getOverview());
  // movie.setReleaseDate(movie.getReleaseDate());
  // movie.setVoteAverage(Math.round(movie.getVoteAverage() * 10));
  // movie.setPosterPath(TMDB_IMAGE_PREFIX + movie.getPosterPath());
  // movie.setTagline(movie.getTagline());
  // movie.setRuntime(movie.getRuntime());
  // movie.setGenres(movie.getGenres());
  // })
  // .collect(Collectors.toList());

  // return new MovieResults(updatedMoviesResults, totalPages);
  // }

  public MovieResults getMovieResults(String endpoint, Integer page)
      throws IOException, InterruptedException, URISyntaxException {
    String url = "https://api.themoviedb.org/3/movie/" + endpoint + "?" +
        "api_key=" + TMDB_API_KEY
        + "&language=en-US&page=" + page
        + "&include_adult=false";

    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(url))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request,
        HttpResponse.BodyHandlers.ofString());
    String responseBody = response.body();
    ObjectMapper objectMapper = new ObjectMapper();

    JsonNode resultsNode = objectMapper.readTree(responseBody).get("results");
    List<MovieCard> movieCardList = new ArrayList<>();
    Integer totalPages = objectMapper.readTree(responseBody).get("total_pages").asInt();

    legacyMovieCardLooping(resultsNode, movieCardList, objectMapper);

    return new MovieResults(movieCardList, totalPages);
  }

  public HashMap<Integer, String> parseGenreIds() {
    Properties properties = new Properties();
    HashMap<Integer, String> movieGenres = new HashMap<>();

    try (InputStream input = getClass().getClassLoader().getResourceAsStream("movieGenres.properties")) {
      if (input != null) {
        properties.load(input);

        for (String key : properties.stringPropertyNames()) {
          movieGenres.put(Integer.parseInt(key), properties.getProperty(key));
        }
      }
    } catch (IOException | NumberFormatException e) {
      e.printStackTrace();
    }

    return movieGenres;
  }

  private void setGenresProperty(MovieCard movieCard, JsonNode node, String propertyName) {
    JsonNode genresNode = node.get(propertyName);
    if (genresNode != null && genresNode.isArray()) {
      HashMap<Integer, String> movieGenres = parseGenreIds();
      List<String> genresList = new ArrayList<>();
      for (JsonNode genre : genresNode) {
        if (genre.isInt()) {
          int genreId = genre.asInt();
          if (movieGenres.containsKey(genreId)) {
            genresList.add(movieGenres.get(genreId));
          }
        }
      }
      movieCard.setGenres(genresList);
    }
  }

  public List<MovieDb> searchResults(String query) throws IOException, InterruptedException, URISyntaxException {

    List<MovieDb> searchResults = tmdbApi.getSearch().searchMovie(query, 0, "", false, 1).getResults();

    List<MovieDb> updatedSearchResults = searchResults.stream()
        .limit(5)
        .peek(movie -> {
          Integer voteAverage = Math.round(movie.getVoteAverage() * 10);
          movie.setVoteAverage(voteAverage);
        })
        .collect(Collectors.toList());

    return updatedSearchResults;
  }

  // public List<Movie> recommendedMovies(Integer movieId)
  // throws IOException, InterruptedException, URISyntaxException {
  // List<MovieDb> recommendedMovies =
  // tmdbApi.getMovies().getRecommendedMovies(movieId, "", 1).getResults();
  // List<Movie> movieList = new ArrayList<>();

  // recommendedMovies.stream()
  // .limit(20)
  // .peek(movieApi -> {
  // Movie movie = new Movie();
  // String posterUrl = TMDB_IMAGE_PREFIX + movieApi.getPosterPath();
  // movie.setId(movieApi.getId());
  // movie.setPosterUrl(posterUrl);
  // movie.setTitle(movieApi.getTitle());
  // movie.setOverview(movieApi.getOverview());
  // movie.setReleaseDate(movieApi.getReleaseDate());
  // movie.setTagline(movieApi.getTagline());
  // movie.setRuntime(movieApi.getRuntime());
  // movie.setVoteAverage(Math.round(movieApi.getVoteAverage() * 10));
  // movieList.add(movie);
  // })
  // .collect(Collectors.toList());

  // return movieList;
  // }

  public List<MovieCard> recommendedMovies(Integer id)
      throws IOException, InterruptedException, URISyntaxException {
    String url = "https://api.themoviedb.org/3/movie/" + id
        + "/recommendations?language=en-US&page=1&include_adult=false" + "&api_key="
        + TMDB_API_KEY;

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
    ObjectMapper objectMapper = new ObjectMapper();

    JsonNode resultsNode = objectMapper.readTree(responseBody).get("results");
    List<MovieCard> recommendedMovies = new ArrayList<>();
    legacyMovieCardLooping(resultsNode, recommendedMovies, objectMapper);
    return recommendedMovies;

  };

  public void legacyMovieCardLooping(JsonNode resultsNode, List<MovieCard> movies, ObjectMapper objectMapper) {

    resultsNode.forEach(movieNode -> {
      MovieCard movie = objectMapper.convertValue(movieNode, MovieCard.class);
      String posterUrl = TMDB_IMAGE_PREFIX + movieNode.get("poster_path").asText();
      JsonNode JsonNodeVoteAverage = movieNode.get("vote_average");
      double voteAverageValue = JsonNodeVoteAverage.asDouble();
      double roundedVoteAverageValue = Math.round(voteAverageValue * 10.0) / 10.0;
      int voteAverage = (int) Math.round(roundedVoteAverageValue * 10);
      movie.setMovieId(movieNode.get("id").asInt());
      movie.setPosterUrl(posterUrl);
      movie.setVoteAverage(voteAverage);
      movie.setTitle(movie.getTitle());
      movie.setOverview(movie.getOverview());
      movie.setReleaseDate(movie.getReleaseDate());
      movie.setTagline(movie.getTagline());
      movie.setRuntime(movie.getRuntime());

      setGenresProperty(movie, movieNode, "genre_ids");
      movies.add(movie);
    });
  }

  public String getTrailer(Integer movieId) {
    TmdbMovies.MovieMethod appendVideos = TmdbMovies.MovieMethod.videos;
    List<String> youtubeKeys = new ArrayList<>();

    List<Video> trailer = tmdbApi.getMovies().getMovie(movieId, "en-US", appendVideos).getVideos();

    youtubeKeys = trailer.stream()
        .filter(video -> "Trailer".equals(video.getType()) && "YouTube".equals(video.getSite()))
        .map(Video::getKey)
        .collect(Collectors.toList());

    if (!youtubeKeys.isEmpty()) {
      String firstTrailerKey = youtubeKeys.get(0);
      return YT_URL_PREFIX + firstTrailerKey;
    } else {
      return "No Trailers Available";
    }
  }

  public void addMovieToWatchlist(String userId, MovieCard movieCardData) throws Exception {
    try {
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new UsernameNotFoundException("User id not found"));

      List<MovieCard> watchList = user.getWatchList();
      if (watchList == null) {
        watchList = new ArrayList<>();
      }

      boolean watchListMovieAlreadyExists = userRepository.doesMovieExist(userId, movieCardData.getMovieId());

      if (!watchListMovieAlreadyExists) {
        MovieCard movieCard = new MovieCard();
        movieCard.setMovieId(movieCardData.getMovieId());
        movieCard.setVoteAverage(movieCardData.getVoteAverage());
        movieCard.setTitle(movieCardData.getTitle());
        movieCard.setIsSavedToWatchlist(true);
        movieCard.setGenres(movieCardData.getGenres());
        movieCard.setOverview(movieCardData.getOverview());
        movieCard.setPosterUrl(movieCardData.getPosterUrl());
        movieCard.setActors(movieCardData.getActors());
        watchList.add(movieCard);
        user.setWatchList(watchList);
        userRepository.save(user);
      } else {
        throw new Exception("User already has movie in watchlist, returning...");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void deleteMovieFromWatchlist(String userId, Integer movieId) throws IOException {
    try {
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new UsernameNotFoundException("User id not found"));

      List<MovieCard> watchList = user.getWatchList();

      if (watchList != null) {
        Iterator<MovieCard> iterator = watchList.iterator();
        while (iterator.hasNext()) {
          MovieCard movieCard = iterator.next();
          Integer cardMovieId = movieCard.getMovieId();
          if (cardMovieId != null && cardMovieId.equals(movieId)) {
            iterator.remove();
            break;
          }
        }
        user.setWatchList(watchList);
        userRepository.save(user);
      }
    } catch (Exception e) {
      System.out.println(e);
    }
  }

  public List<MovieCard> getUserWatchlist(String userId) throws Exception {
    try {
      List<MovieCard> watchList = userRepository.findUserWithWatchListById(userId).get().getWatchList();
      return watchList;
    } catch (Exception e) {
      throw new Exception();
    }
  }
}