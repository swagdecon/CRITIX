package com.popflix.service;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.popflix.model.Movie;
import com.popflix.model.Person;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.Genre;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.ProductionCompany;
import info.movito.themoviedbapi.model.Reviews;
import info.movito.themoviedbapi.model.Video;
import info.movito.themoviedbapi.model.people.PersonCast;
import jakarta.annotation.PostConstruct;

@Service

public class MovieService {
  @Autowired
  private MongoTemplate mongoTemplate;
  private final TmdbApi tmdbApi = new TmdbApi("d84f9365179dc98dc69ab22833381835");

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

    movie.setAdult(movieDb.isAdult());
    movie.setTitle(movieDb.getOriginalTitle());
    movie.setOriginalLanguage(movieDb.getOriginalLanguage());
    movie.setOverview(movieDb.getOverview());
    movie.setPopularity(movieDb.getPopularity());
    movie.setPosterPath(movieDb.getPosterPath());
    movie.setBackdropPath(movieDb.getBackdropPath());
    movie.setImdbId(movieDb.getImdbID());
    movie.setReleaseDate(movieDb.getReleaseDate());
    movie.setVideo(movie.getVideo());
    movie.setVoteAverage(movie.getVoteAverage());
    movie.setVoteCount(movie.getVoteCount());
    updateTmdbMovieDetails(movie);
    return Optional.of(movie);
  }

  // ScheduledExecutorService is created in the init method and a task is
  // scheduled to run every 24 hours using scheduleAtFixedRate. The updateMovies
  // method will be called by the scheduled task.
  private ScheduledExecutorService executor;

  @PostConstruct
  public void init() {
    executor = Executors.newScheduledThreadPool(1);
    executor.scheduleAtFixedRate(this::updateMovies, 0, 24, TimeUnit.HOURS);
  }

  public void shutdown() {
    executor.shutdown();
  }

  public void updateMovies() {
    saveMovieDetails("now_playing");
    saveMovieDetails("popular");
    saveMovieDetails("top_rated");
    saveMovieDetails("upcoming_movies");

    updateMovieDetails("now_playing");
    updateMovieDetails("popular");
    updateMovieDetails("top_rated");
    updateMovieDetails("upcoming_movies");

  }

  public void updateMovieDetails(String collectionName) {
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
        float voteAverage = movieDb.getVoteAverage();

        movie.setVoteAverage(voteAverage);
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

      if (movie.getVideo() == null || movie.getVideo().isEmpty()) {
        List<Video> movieVideos = tmdbApi.getMovies().getVideos(movie.getId(), "en-US");

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
          List<String> videoKeys = new ArrayList<>();
          videoKeys.add(mainTrailerKey);
          movie.setVideo(videoKeys);
        }
      }

      mongoTemplate.save(movie, collectionName);
    }
  }

  public void updateTmdbMovieDetails(Movie movie) {
    MovieDb movieDb = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");

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
        person.setId(cast.getCastId());
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

    if (movie.getVoteAverage() == null) {
      float voteAverage = movieDb.getVoteAverage();

      movie.setVoteAverage(voteAverage);
    }

    if (movie.getImdbId() == null) {
      String imdbId = movieDb.getImdbID();

      movie.setImdbId(imdbId);
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

    if (movie.getVideo() == null || movie.getVideo().isEmpty()) {
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
        List<String> videoKeys = new ArrayList<>();
        videoKeys.add(mainTrailerKey);
        movie.setVideo(videoKeys);
      }
    }
  }

  public void saveMovieDetails(String collectionName) {
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
      movie.setId(movieDb.getId());
      movie.setAdult(movieDb.isAdult());
      movie.setTitle(movieDb.getOriginalTitle());
      movie.setOriginalLanguage(movieDb.getOriginalLanguage());
      movie.setOverview(movieDb.getOverview());
      movie.setPopularity(movieDb.getPopularity());
      movie.setPosterPath(movieDb.getPosterPath());
      movie.setBackdropPath(movieDb.getBackdropPath());
      movie.setReleaseDate(movieDb.getReleaseDate());
      movie.setVideo(movie.getVideo());
      movie.setVoteAverage(movie.getVoteAverage());
      movie.setVoteCount(movie.getVoteCount());
      movies.add(movie);
      mongoTemplate.save(movie, collectionName);

    }
  }
}