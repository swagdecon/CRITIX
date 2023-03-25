package com.popflix.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import com.popflix.model.Movie;
import info.movito.themoviedbapi.TmdbApi;
import info.movito.themoviedbapi.model.Credits;
import info.movito.themoviedbapi.model.Genre;
import info.movito.themoviedbapi.model.MovieDb;
import info.movito.themoviedbapi.model.Video;
import info.movito.themoviedbapi.model.people.PersonCast;

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
        List<String> actorImagePaths = new ArrayList<>(); // add new list

        for (PersonCast cast : castList) {
          actorNames.add(cast.getName());
          actorImagePaths.add(cast.getProfilePath()); // add image path to the new list
        }
        movie.setActors(actorNames);
        movie.setActorImagePaths(actorImagePaths); // set the new list on the movie object

      }
      if (movie.getVideo() == null || movie.getVideo().isEmpty()) {
        // Get the movie videos
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