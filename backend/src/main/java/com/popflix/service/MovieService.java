package com.popflix.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.popflix.model.Movie;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.Genre;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.ProductionCompany;
import info.movito.themoviedbapi.model.Reviews;
import info.movito.themoviedbapi.model.Video;
import info.movito.themoviedbapi.model.people.PersonCast;

@Service
public class MovieService {
  @Autowired
  private MongoTemplate mongoTemplate;
  private final TmdbApi tmdbApi = new TmdbApi("d84f9365179dc98dc69ab22833381835");

  @Scheduled(cron = "0 0 0 * * ?")
  public void updateMovieDetailsScheduled() {
    updateMovieDetails("movies");
    updateMovieDetails("now_playing");
    updateMovieDetails("popular");
    updateMovieDetails("top_rated");
    updateMovieDetails("upcoming_movies");
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

      if (movie.getActors() == null || movie.getActors().isEmpty() || movie.getActorImagePaths() == null
          || movie.getActorImagePaths().isEmpty()) {
        Credits movieCredits = tmdbApi.getMovies().getCredits(movie.getId());
        List<PersonCast> castList = movieCredits.getCast();
        List<String> actorNames = new ArrayList<>();
        List<String> actorImagePaths = new ArrayList<>();
        for (PersonCast cast : castList) {
          actorNames.add(cast.getName());
        }
        for (int i = 0; i < Math.min(castList.size(), 5); i++) {
          PersonCast cast = castList.get(i);
          actorImagePaths.add(cast.getProfilePath());
        }
        movie.setActors(actorNames);
        movie.setActorImagePaths(actorImagePaths);
      }

      if (movie.getReviews() == null || movie.getReviews().isEmpty()) {
        List<Reviews> reviews = tmdbApi.getReviews().getReviews(movie.getId(), "en-US", 1).getResults();

        // Extract the review text for each review
        List<String> reviewTexts = new ArrayList<>();
        for (Reviews review : reviews) {
          String content = review.getContent();
          if (content.split("\\s+").length < 200 && !content.contains("SPOILER-FREE")
              && content.split("\\s+").length > 100) {
            reviewTexts.add(content);
          }
        }

        movie.setReviews(reviewTexts);
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

}