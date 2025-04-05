package com.critix.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.critix.config.EnvLoader;
import com.critix.model.Movie;
import com.critix.model.MovieCard;
import com.critix.model.MovieResults;
import com.critix.model.Person;
import com.critix.model.User;
import com.critix.repository.MovieRepository;
import com.critix.repository.UserRepository;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.core.Genre;
import info.movito.themoviedbapi.model.core.MovieResultsPage;
import info.movito.themoviedbapi.model.core.ProductionCompany;
import info.movito.themoviedbapi.model.core.Review;
import info.movito.themoviedbapi.model.core.ReviewResultsPage;
import info.movito.themoviedbapi.model.core.video.VideoResults;
import info.movito.themoviedbapi.model.core.watchproviders.WatchProviders;
import info.movito.themoviedbapi.model.movielists.MovieResultsPageWithDates;
import info.movito.themoviedbapi.model.movies.Credits;
import info.movito.themoviedbapi.model.movies.MovieDb;
import info.movito.themoviedbapi.tools.TmdbException;
import info.movito.themoviedbapi.tools.appendtoresponse.MovieAppendToResponse;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;

@Service
public class MovieService {
  private ScheduledExecutorService executor;
  private EnvLoader envLoader = new EnvLoader();

  Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

  private String TMDB_ACCESS_TOKEN = envLoader.getEnv("TMDB_ACCESS_TOKEN", dotenv);
  private String YT_URL_PREFIX = envLoader.getEnv("YT_URL_PREFIX", dotenv);
  private String TMDB_IMAGE_PREFIX = envLoader.getEnv("TMDB_IMAGE_PREFIX", dotenv);

  private final MovieRepository movieRepository;
  private final MongoTemplate mongoTemplate;
  @Autowired
  private UserRepository userRepository;

  private TmdbApi tmdbApi = new TmdbApi(TMDB_ACCESS_TOKEN);

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

  @PostConstruct // This will make sure the method runs once when the application starts
  public void startNowAndSchedule() {
    // Execute the task immediately after application starts
    updateRecommendationsForAllUsers();
  }

  // This method will now run for all users automatically every 24 hours
  @Scheduled(cron = "0 0 0 * * *") // Runs every day at midnight
  public void updateRecommendationsForAllUsers() {
    // Get all users from the database (this may need pagination if you have many
    // users)
    List<User> users = userRepository.findAll();

    // Loop through all users to update their recommendations
    for (User user : users) {
      try {
        updateUserRecommendations(user);
      } catch (Exception e) {
        System.out.println("Error updating recommendations for user " + user.getId() + ": " + e.getMessage());
      }
    }
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
      boolean watchListMovieAlreadyExists = userRepository.doesWatchlistMovieExist(userId, movie.getId());
      boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movie.getId());

      movie.setIsSavedToWatchlist(watchListMovieAlreadyExists);
      movie.setIsSavedToFavouriteMoviesList(favouriteMovieAlreadyExists);
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
      boolean watchListMovieAlreadyExists = userRepository.doesWatchlistMovieExist(userId, movie.getId());
      boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movie.getId());

      movie.setIsSavedToWatchlist(watchListMovieAlreadyExists);
      movie.setIsSavedToFavouriteMoviesList(favouriteMovieAlreadyExists);
      return Optional.of(movie);
    } else {
      return Optional.empty();
    }
  }

  private void setMovieDetails(Movie movie, MovieDb movieApi)
      throws IOException, InterruptedException, URISyntaxException, TmdbException {

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
    movie.setMovieStatus(movieApi.getStatus());
    movie.setVoteCount(movieApi.getVoteCount());
    movie.setVoteAverage(movieApi.getVoteAverage() != null ? (int) Math.round(movieApi.getVoteAverage() * 10) : null);

    movie.setProductionCompanies(movieApi.getProductionCompanies().stream()
        .map(ProductionCompany::getName)
        .collect(Collectors.toList()));

    movie.setGenres(movieApi.getGenres().stream()
        .map(Genre::getName)
        .collect(Collectors.toList()));
    // Complex fields which require functions to parse api data
    setActors(movie, movieApi.getCredits());
    setReviews(movie, movieApi.getReviews());
    setTrailer(movie, movieApi.getVideos());
  }

  public Optional<Movie> singleTmdbMovie(Integer movieId, String userId)
      throws IOException, InterruptedException, URISyntaxException, TmdbException {

    boolean watchListMovieAlreadyExists = userRepository.doesWatchlistMovieExist(userId, movieId);
    boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movieId);

    MovieDb movieApi = tmdbApi.getMovies().getDetails(movieId, "en-US", MovieAppendToResponse.REVIEWS,
        MovieAppendToResponse.VIDEOS, MovieAppendToResponse.CREDITS, MovieAppendToResponse.WATCH_PROVIDERS);

    Movie movie = new Movie();
    movie.setId(movieId);
    movie.setIsSavedToWatchlist(watchListMovieAlreadyExists);
    movie.setIsSavedToFavouriteMoviesList(favouriteMovieAlreadyExists);
    setMovieDetails(movie, movieApi);

    return Optional.of(movie);
  }

  private void setProviderResults(Movie movie, Map<String, WatchProviders> watchProviderList) {
    Map<String, Object> resultMap = watchProviderList.entrySet().stream()
        .filter(entry -> "US".equals(entry.getKey()) || "GB".equals(entry.getKey()))
        .collect(Collectors.toMap(
            entry -> "US".equals(entry.getKey()) ? "US" : "UK",
            entry -> entry.getValue().toString()));

    movie.setProviderResults(resultMap);
  }

  private void setActors(Movie movie, Credits credits) {
    if (credits != null) {
      List<Person> actors = credits.getCast().stream()
          .map(cast -> {
            Person person = new Person();
            person.setId(cast.getId());
            person.setName(cast.getName());
            person.setProfilePath(cast.getProfilePath());
            return person;
          })
          .collect(Collectors.toList());

      movie.setActors(actors);
    }
  }

  private void setReviews(Movie movie, ReviewResultsPage reviews) {
    if (movie.getReviews() == null || movie.getReviews().isEmpty()) {
      List<String> reviewTexts = StreamSupport.stream(reviews.spliterator(), false)
          .map(Review::getContent)
          .filter(content -> {
            int wordCount = content.split("\\s+").length;
            return wordCount < 300 && wordCount > 20 && !content.contains("SPOILER-FREE");
          })
          .collect(Collectors.toList());

      movie.setReviews(reviewTexts);
    }
  }

  private void setTrailer(Movie movie, VideoResults movieVideos) {
    if (movie.getTrailer() == null || movie.getTrailer().isEmpty()) {
      StreamSupport.stream(movieVideos.spliterator(), false)
          .filter(video -> "Trailer".equals(video.getType()) && "YouTube".equals(video.getSite()))
          .findFirst()
          .ifPresent(video -> movie.setTrailer(YT_URL_PREFIX + video.getKey()));
    }
  }

  public String getTrailer(Integer movieId) throws TmdbException {
    VideoResults allVideos = tmdbApi.getMovies().getVideos(movieId, "en-US");

    return StreamSupport.stream(allVideos.spliterator(), false)
        .filter(video -> "Trailer".equals(video.getType()) && "YouTube".equals(video.getSite()))
        .findFirst()
        .map(video -> YT_URL_PREFIX + video.getKey())
        .orElse(null);
  }

  public CompletableFuture<Void> saveTop20ListDetails(String collectionName) {
    return CompletableFuture.runAsync(() -> {
      List<Movie> movies = new ArrayList<>();
      List<info.movito.themoviedbapi.model.core.Movie> collection = null;

      mongoTemplate.dropCollection(collectionName);

      switch (collectionName) {
        case "now_playing":
          try {
            collection = tmdbApi.getMovieLists().getNowPlaying("en-US", 1, null).getResults();
          } catch (TmdbException e) {
            e.printStackTrace();
          }
          break;
        case "popular":
          try {
            collection = tmdbApi.getMovieLists().getPopular("en-US", 1, null).getResults();
          } catch (TmdbException e) {
            e.printStackTrace();
          }
          break;
        case "top_rated":
          try {
            collection = tmdbApi.getMovieLists().getTopRated("en-US", 1, null).getResults();
          } catch (TmdbException e) {
            e.printStackTrace();
          }
          break;
        case "upcoming_movies":
          try {
            collection = tmdbApi.getMovieLists().getUpcoming("en-US", 1, null).getResults();
          } catch (TmdbException e) {
            e.printStackTrace();
          }
          break;
        default:
          throw new IllegalArgumentException("Invalid method name: " + collectionName);
      }

      for (info.movito.themoviedbapi.model.core.Movie movieApi : collection) {
        Movie movie = new Movie();

        String posterUrl = TMDB_IMAGE_PREFIX + movieApi.getPosterPath();
        String backdropUrl = TMDB_IMAGE_PREFIX + movieApi.getBackdropPath();

        movie.setId(movieApi.getId());
        movie.setTitle(movieApi.getTitle());
        movie.setOriginalLanguage(movieApi.getOriginalLanguage());
        movie.setOverview(movieApi.getOverview());
        movie.setPopularity(movieApi.getPopularity());
        movie.setPosterUrl(posterUrl);
        movie.setBackdropUrl(backdropUrl);
        movie.setReleaseDate(movieApi.getReleaseDate());
        movie.setVoteAverage((int) Math.round(movieApi.getVoteAverage() * 10));
        movie.setVoteCount(movieApi.getVoteCount());
        movies.add(movie);
      }

      if (!movies.isEmpty()) {
        mongoTemplate.insert(movies, collectionName);
        updateMovieDbDetails(collectionName);
      }
    });
  }

  public CompletableFuture<Void> updateMovieDbDetails(String collectionName) {
    return CompletableFuture.runAsync(() -> {
      List<Movie> movies = getTop20Movies(collectionName);
      for (Movie movie : movies) {
        try {

          MovieDb movieApi = tmdbApi.getMovies().getDetails(movie.getId(), "en-US", MovieAppendToResponse.REVIEWS,
              MovieAppendToResponse.VIDEOS, MovieAppendToResponse.CREDITS, MovieAppendToResponse.WATCH_PROVIDERS);

          if (movie.getTagline() == null) {
            movie.setTagline(movieApi.getTagline());
          }
          if (movie.getBudget() == null) {
            movie.setBudget(movieApi.getBudget());
          }
          if (movie.getRevenue() == null) {
            movie.setRevenue(movieApi.getRevenue());
          }
          if (movie.getRuntime() == null) {
            movie.setRuntime(movieApi.getRuntime());
          }
          if (movie.getImdbId() == null) {
            String imdbId = movieApi.getImdbID();
            movie.setImdbId(imdbId);
          }
          movie.setMovieStatus(movieApi.getStatus());
          setProviderResults(movie, movieApi.getWatchProviders().getResults());

          movie.setGenres(movieApi.getGenres().stream()
              .map(Genre::getName)
              .collect(Collectors.toList()));
          setActors(movie, movieApi.getCredits());
          setReviews(movie, movieApi.getReviews());
          movie.setProductionCompanies(movieApi.getProductionCompanies().stream()
              .map(ProductionCompany::getName)
              .collect(Collectors.toList()));

          setTrailer(movie, movieApi.getVideos());
          mongoTemplate.save(movie, collectionName);
        } catch (TmdbException e) {
          System.err.println("Error fetching details for movie with ID: " + movie.getId());
          e.printStackTrace();
        }
      }
    });
  }

  public MovieResults getMovieResults(String endpoint, Integer page, String userId) throws TmdbException {

    MovieResultsPage results;
    Integer totalPages;
    List<info.movito.themoviedbapi.model.core.Movie> movieResults;

    switch (endpoint) {
      case "now_playing":
        MovieResultsPageWithDates nowPlayingResults = tmdbApi.getMovieLists().getNowPlaying("en-US", page, null);
        movieResults = nowPlayingResults.getResults();
        totalPages = nowPlayingResults.getTotalPages();
        break;
      case "popular":
        results = tmdbApi.getMovieLists().getPopular("en-US", page, null);
        movieResults = results.getResults();
        totalPages = results.getTotalPages();
        break;
      case "top_rated":
        results = tmdbApi.getMovieLists().getTopRated("en-US", page, null);
        movieResults = results.getResults();
        totalPages = results.getTotalPages();
        break;
      case "upcoming":
        MovieResultsPageWithDates upcomingResults = tmdbApi.getMovieLists().getUpcoming("en-US", page, null);
        movieResults = upcomingResults.getResults();
        totalPages = upcomingResults.getTotalPages();
        break;
      default:
        throw new IllegalArgumentException("Invalid method name: " + endpoint);
    }

    List<MovieCard> updatedMoviesResults = new ArrayList<>();
    HashMap<Integer, String> movieGenres = parseGenreIds();

    movieResults.forEach(movie -> {
      MovieCard movieCard = new MovieCard();
      boolean isInWatchlist = userRepository.doesWatchlistMovieExist(userId, movie.getId());
      boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movie.getId());

      movieCard.setMovieId(movie.getId());
      movieCard.setTitle(movie.getTitle());
      movieCard.setOverview(movie.getOverview());
      movieCard.setReleaseDate(movie.getReleaseDate());
      movieCard.setPopularity(movie.getPopularity());
      movieCard.setVoteAverage((int) Math.round(movie.getVoteAverage() * 10));
      movieCard.setPosterUrl(TMDB_IMAGE_PREFIX + movie.getPosterPath());
      movieCard.setIsSavedToWatchlist(isInWatchlist);
      movieCard.setIsSavedToFavouriteMoviesList(favouriteMovieAlreadyExists);

      List<String> genres = movie.getGenreIds().stream()
          .map(movieGenres::get)
          .collect(Collectors.toList());
      movieCard.setGenres(genres);

      updatedMoviesResults.add(movieCard);
    });

    return new MovieResults(updatedMoviesResults, totalPages);
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

  public List<info.movito.themoviedbapi.model.core.Movie> searchResults(String query)
      throws IOException, InterruptedException, URISyntaxException, TmdbException {

    List<info.movito.themoviedbapi.model.core.Movie> searchResults = tmdbApi.getSearch()
        .searchMovie(query, false, "en-US", null, null, null, null)
        .getResults();

    List<info.movito.themoviedbapi.model.core.Movie> updatedSearchResults = searchResults.stream()
        .limit(5)
        .peek(movie -> {
          movie.setVoteAverage((double) Math.round(movie.getVoteAverage() * 10));

        })
        .collect(Collectors.toList());

    return updatedSearchResults;
  }

  public List<MovieCard> recommendedMovies(Integer movieId, String userId)
      throws IOException, InterruptedException, URISyntaxException, TmdbException {

    List<info.movito.themoviedbapi.model.core.Movie> recommendedMovies = tmdbApi.getMovies()
        .getRecommendations(movieId, "", 1).getResults();
    List<MovieCard> movieList = new ArrayList<>();
    HashMap<Integer, String> movieGenres = parseGenreIds();

    recommendedMovies.stream()
        .limit(20)
        .forEach(movieApi -> {
          MovieCard movieCard = new MovieCard();
          String posterUrl = TMDB_IMAGE_PREFIX + movieApi.getPosterPath();
          boolean isInWatchlist = userRepository.doesWatchlistMovieExist(userId, movieApi.getId());
          boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movieApi.getId());
          movieCard.setMovieId(movieApi.getId());
          movieCard.setPosterUrl(posterUrl);
          movieCard.setTitle(movieApi.getTitle());
          movieCard.setOverview(movieApi.getOverview());
          movieCard.setReleaseDate(movieApi.getReleaseDate());
          movieCard.setVoteAverage((int) Math.round(movieApi.getVoteAverage() * 10));
          movieCard.setIsSavedToWatchlist(isInWatchlist);
          movieCard.setIsSavedToFavouriteMoviesList(favouriteMovieAlreadyExists);

          movieCard.setGenres(movieApi.getGenreIds().stream()
              .map(movieGenres::get)
              .collect(Collectors.toList()));

          movieList.add(movieCard);
        });

    return movieList;
  }

  public void addMovieToWatchlist(String userId, MovieCard movieCardData) throws Exception {
    try {
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new UsernameNotFoundException("User id not found"));

      List<MovieCard> watchList = user.getWatchList();
      if (watchList == null) {
        watchList = new ArrayList<>();
      }

      boolean watchListMovieAlreadyExists = userRepository.doesWatchlistMovieExist(userId, movieCardData.getMovieId());

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

  public void updateUserRecommendations(User user) {
    try {
      List<MovieCard> favMovieList = userRepository.findUserWithFavouriteMoviesListById(user.getId()).get()
          .getFavouriteMoviesList();

      if (favMovieList == null || favMovieList.isEmpty()) {
        return;
      }
      if (user.getRecommendedMovies() == null) {
        user.setRecommendedMovies(new ArrayList<>());
      }

      Collections.shuffle(favMovieList);
      List<MovieCard> selectedMovies = favMovieList.subList(0, Math.min(3, favMovieList.size()));

      Set<Integer> recommendedIds = new HashSet<>();
      HashMap<Integer, String> movieGenres = parseGenreIds();

      for (MovieCard fav : selectedMovies) {
        List<info.movito.themoviedbapi.model.core.Movie> recs = tmdbApi.getMovies()
            .getRecommendations(fav.getMovieId(), "", 1)
            .getResults();
        System.out.println("GOING HERE 1");
        for (int i = 0; i < Math.min(2, recs.size()); i++) {
          info.movito.themoviedbapi.model.core.Movie recommendedMovie = recs.get(i);

          recommendedIds.add(recommendedMovie.getId());

          MovieCard movieCard = new MovieCard();
          movieCard.setMovieId(recommendedMovie.getId());
          movieCard.setTitle(recommendedMovie.getTitle());
          movieCard.setOverview(recommendedMovie.getOverview());
          movieCard.setPosterUrl(recommendedMovie.getPosterPath());
          movieCard.setReleaseDate(recommendedMovie.getReleaseDate());
          movieCard.setPopularity(recommendedMovie.getPopularity());
          movieCard.setVoteAverage((int) Math.round(recommendedMovie.getVoteAverage() * 10));

          movieCard.setGenres(recommendedMovie.getGenreIds().stream()
              .map(movieGenres::get)
              .collect(Collectors.toList()));

          user.getRecommendedMovies().add(movieCard);

          if (user.getRecommendedMovies().size() >= 6) {
            break;
          }
        }

        if (user.getRecommendedMovies().size() >= 6) {
          break;
        }
      }
      userRepository.save(user);

    } catch (Exception e) {
      System.out.println("Error updating recommendations: " + e.getMessage());
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
      if (watchList != null) {
        for (MovieCard movie : watchList) {
          boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movie.getMovieId());
          movie.setIsSavedToFavouriteMoviesList(favouriteMovieAlreadyExists);
        }
      }
      return watchList;
    } catch (Exception e) {
      throw new Exception("Error fetching user's watchlist", e);
    }
  }

  public void addMovieToFavourites(String userId, MovieCard movieCardData) throws Exception {
    try {
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new UsernameNotFoundException("User id not found"));

      List<MovieCard> favouriteMovieList = user.getFavouriteMoviesList();

      if (favouriteMovieList == null) {
        favouriteMovieList = new ArrayList<>();
        return;
      }

      boolean favouriteMovieAlreadyExists = userRepository.doesFavouriteMovieExist(userId, movieCardData.getMovieId());

      if (!favouriteMovieAlreadyExists) {
        MovieCard movieCard = new MovieCard();
        movieCard.setMovieId(movieCardData.getMovieId());
        movieCard.setVoteAverage(movieCardData.getVoteAverage());
        movieCard.setTitle(movieCardData.getTitle());
        movieCard.setIsSavedToFavouriteMoviesList(true);
        movieCard.setGenres(movieCardData.getGenres());
        movieCard.setOverview(movieCardData.getOverview());
        movieCard.setPosterUrl(movieCardData.getPosterUrl());
        movieCard.setActors(movieCardData.getActors());
        favouriteMovieList.add(movieCard);
        user.setFavouriteMoviesList(favouriteMovieList);
        userRepository.save(user);
      } else {
        throw new Exception("User already has movie in favourite movie list, returning...");
      }
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  public void deleteMovieFromFavouriteMoviesList(String userId, Integer movieId) throws IOException {
    try {
      User user = userRepository.findById(userId)
          .orElseThrow(() -> new UsernameNotFoundException("User id not found"));

      List<MovieCard> favouriteMoviesList = user.getFavouriteMoviesList();

      if (favouriteMoviesList != null) {
        Iterator<MovieCard> iterator = favouriteMoviesList.iterator();
        while (iterator.hasNext()) {
          MovieCard movieCard = iterator.next();
          Integer cardMovieId = movieCard.getMovieId();
          if (cardMovieId != null && cardMovieId.equals(movieId)) {
            iterator.remove();
            break;
          }
        }
        user.setFavouriteMoviesList(favouriteMoviesList);
        userRepository.save(user);
      }
    } catch (Exception e) {
      System.out.println(e);
    }
  }

  public List<MovieCard> getUserFavouriteMoviesList(String userId) throws Exception {
    try {
      List<MovieCard> favouriteMovieList = userRepository.findUserWithFavouriteMoviesListById(userId).get()
          .getFavouriteMoviesList();

      if (favouriteMovieList != null) {
        for (MovieCard movie : favouriteMovieList) {
          boolean isInWatchlist = userRepository.doesWatchlistMovieExist(userId, movie.getMovieId());
          movie.setIsSavedToWatchlist(isInWatchlist);
        }
      }
      return favouriteMovieList;
    } catch (Exception e) {
      throw new Exception("Error fetching user's favourite movies list", e);
    }
  }
}