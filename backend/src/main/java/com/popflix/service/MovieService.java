package com.popflix.service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.popflix.model.Movie;
import com.popflix.model.MovieCard;
import com.popflix.model.MovieResults;
import com.popflix.model.Person;
import com.popflix.repository.MovieRepository;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.TmdbMovies;
import info.movito.themoviedbapi.TmdbMovies.MovieMethod;
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

  @PostConstruct
  public void init() {
    executor = Executors.newScheduledThreadPool(1);
    executor.scheduleAtFixedRate(this::saveTopMovies, 0, 24, TimeUnit.HOURS);
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

  public List<Movie> getTop20Movies(String collectionName) {
    Query query = new Query();
    return mongoTemplate.find(query, Movie.class, collectionName);
  }

  public Optional<Movie> singleMovie(Integer id, String collectionName) {
    Query query = new Query();
    query.addCriteria(Criteria.where("id").is(id));
    return Optional.ofNullable(mongoTemplate.findOne(query, Movie.class, collectionName));
  }

  private void setMovieDetails(Movie movie, MovieDb movieApi) {

    String posterUrl = movieUrl + movieApi.getPosterPath();
    String backdropUrl = movieUrl + movieApi.getBackdropPath();
    movie.setAdult(movieApi.isAdult());
    movie.setTitle(movieApi.getOriginalTitle());
    movie.setOriginalLanguage(movieApi.getOriginalLanguage());
    movie.setOverview(movieApi.getOverview());
    movie.setPopularity(movieApi.getPopularity());
    movie.setPosterUrl(posterUrl);
    movie.setBackdropUrl(backdropUrl);
    movie.setImdbId(movieApi.getImdbID());
    movie.setReleaseDate(movieApi.getReleaseDate());
    movie.setVoteCount(movieApi.getVoteCount());
    movie.setBudget(movieApi.getBudget());
    movie.setTagline(movieApi.getTagline());
    movie.setRevenue(movieApi.getRevenue());
    movie.setRuntime(movieApi.getRuntime());
    movie.setVoteCount(movieApi.getVoteCount());
    movie.setImdbId(movieApi.getImdbID());

    // Complex fields which require functions to parse api data
    setVoteAverage(movie, movieApi);
    setGenres(movie, movieApi);
    setActors(movie, movieApi);
    setReviews(movie, movieApi);
    setProductionCompanies(movie, movieApi);
    setMovieStatus(movie, movieApi);
    setTrailer(movie, movieApi);
  }

  public Optional<Movie> singleTmdbMovie(Integer movieId) {
    Movie movie = new Movie();
    movie.setId(movieId);
    MovieDb movieApi = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");

    setMovieDetails(movie, movieApi);
    return Optional.of(movie);
  }

  private void setVoteAverage(Movie movie, MovieDb movieApi) {
    if (movie.getVoteAverage() == null) {
      movie.setVoteAverage(Math.round(movieApi.getVoteAverage() * 10));
    }
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
        movie.setTrailer("https://www.youtube.com/watch?v=" + mainTrailerKey);
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
        movie.setVoteAverage(movie.getVoteAverage());
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

  public MovieResults getMovieResults(String endpoint, Integer page)
      throws IOException, InterruptedException, URISyntaxException {
    String url = "https://api.themoviedb.org/3/movie/" + endpoint + "?" + "api_key=" + TMDB_API_KEY
        + "&language=en-US&page=" + page
        + "&include_adult=false";

    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest request = HttpRequest.newBuilder()
        .uri(new URI(url))
        .GET()
        .build();

    HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
    String responseBody = response.body();
    ObjectMapper objectMapper = new ObjectMapper();

    JsonNode resultsNode = objectMapper.readTree(responseBody).get("results");
    List<MovieCard> movieCardList = new ArrayList<>();
    Integer totalPages = objectMapper.readTree(responseBody).get("total_pages").asInt();

    resultsNode.forEach(movieNode -> {
      MovieCard movie = objectMapper.convertValue(movieNode, MovieCard.class);
      String posterUrl = movieUrl + movieNode.get("poster_path").asText();
      long voteAverage = movieNode.get("vote_average").asLong();

      movie.setPosterUrl(posterUrl);
      movie.setVoteAverage(Math.round(voteAverage) * 10);

      // Set other fields needed for Movie card
      movie.setTitle(movie.getTitle());
      movie.setOverview(movie.getOverview());
      movie.setReleaseDate(movie.getReleaseDate());
      movie.setTagline(movie.getTagline());
      movie.setRuntime(movie.getRuntime());

      setGenresProperty(movie, movieNode, "genre_ids");
      movieCardList.add(movie);
    });

    return new MovieResults(movieCardList, totalPages);
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

  private void setGenresProperty(MovieCard movieCard, JsonNode node, String propertyName) {
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
      movieCard.setGenres(genresList);
    }
  }

  public List<Movie> recommendedMovies(Integer movieId)
      throws IOException, InterruptedException, URISyntaxException {
    List<MovieDb> recommendedMovies = tmdbApi.getMovies().getRecommendedMovies(movieId, "", 1).getResults();
    List<Movie> movieList = new ArrayList<>();
    recommendedMovies.stream()
        .peek(movieDb -> {
          Movie movie = new Movie();
          String posterUrl = movieUrl + movieDb.getPosterPath();

          movie.setId(movieDb.getId());
          movie.setPosterUrl(posterUrl);
          movie.setTitle(movieDb.getTitle());
          movie.setOverview(movieDb.getOverview());
          movie.setReleaseDate(movieDb.getReleaseDate());
          movie.setTagline(movieDb.getTagline());
          movie.setRuntime(movieDb.getRuntime());
          movie.setVoteAverage(Math.round(movieDb.getVoteAverage() * 10));
          movieList.add(movie);
        })
        .collect(Collectors.toList());

    return movieList;
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
      return "https://www.youtube.com/watch?v=" + firstTrailerKey;
    } else {
      return "No Trailers Available";
    }
  }
}