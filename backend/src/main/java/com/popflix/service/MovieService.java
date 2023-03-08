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

  public List < Movie > allMovies(String collectionName) {
    Query query = new Query();
    return mongoTemplate.find(query, Movie.class, collectionName);
  }

  public Optional < Movie > singleMovie(Integer id, String collectionName) {
    Query query = new Query();
    query.addCriteria(Criteria.where("id").is(id));
    return Optional.ofNullable(mongoTemplate.findOne(query, Movie.class, collectionName));
  }

  // THIS WILL NEED EXTRACTING AND SAVING TO ITS OWN FILE / SERVICE IN FUTURE - 
  // TO BE PAIRED WITH A FILE THAT CONTROLS A PERIODIC FETCH OF NEW DATA FROM THE API TO SAVE TO OUR DB EVERY # DAYS.

  // THIS METHOD LOOKS UP EACH MOVIE WITHIN A SPECIFIED COLLECTION AGAINST THE API IN ORDER TO SAVE ADDITIONAL DETAILS
  // ABOUT EACH MOVIE TO OUR DB THAT WERE NOT PRESENT AS PART OF THE LIST.
  public void updateMovieDetails(String collectionName) {
    List < Movie > movies = allMovies(collectionName);
    for (Movie movie: movies) {
      MovieDb movieDb = tmdbApi.getMovies().getMovie(movie.getId(), "en-US");
      movie.setBudget(movieDb.getBudget());
      movie.setTagline(movieDb.getTagline());
      movie.setRevenue(movieDb.getRevenue());
      movie.setRuntime(movieDb.getRuntime());

      // Get the movie genres
      List < Genre > genres = movieDb.getGenres();

      // Extract the movie genre names
      List < String > genreNames = new ArrayList < > ();
      for (Genre genre: genres) {
        genreNames.add(genre.getName());
      }
      movie.setGenres(genreNames);

      // Get the movie credits
      Credits movieCredits = tmdbApi.getMovies().getCredits(movie.getId());

      // Extract the actor names
      List < String > actorNames = new ArrayList < > ();
      for (PersonCast cast: movieCredits.getCast()) {
        actorNames.add(cast.getName());
      }
      movie.setActors(actorNames);

      // Get the movie videos
      List < Video > movieVideos = tmdbApi.getMovies().getVideos(movie.getId(), "en-US");

      // Extract the video key for the main trailer
      String mainTrailerKey = null;
      for (Video video: movieVideos) {
        if (video.getType().equals("Trailer") && video.getSite().equals("YouTube")) {
          mainTrailerKey = video.getKey();
          break;
        }
      }

      // Set the main trailer video key for the movie
      if (mainTrailerKey != null) {
        List < String > videoKeys = new ArrayList < > ();
        videoKeys.add(mainTrailerKey);
        movie.setVideo(videoKeys);
      }

      mongoTemplate.save(movie, collectionName);

    }
  }
}