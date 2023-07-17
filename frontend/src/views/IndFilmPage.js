import React, { useState } from "react";
import { useParams } from "react-router-dom";
import IndMovieStyle from "../components/IndMovie/ind_movie.module.css";
import ActorCarouselStyle from "../components/Carousel/ActorCarousel/ActorCarousel.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import UserMovieReviews from "../components/Review/MovieReviews";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  ParseDate,
  EmbeddedMovieTrailer,
  MovieDetails,
} from "../components/IndMovie/MovieComponents";
import RecommendedCarousel from "../components/Carousel/RecommendedCarousel/RecommendedCarousel";
import MovieActors from "../components/Carousel/ActorCarousel/ActorCarousel";
import LoadingPage from "./LoadingPage";
import MovieButton from "../components/Other/btn/MovieButton/Button";
import fetchData from "../security/FetchApiData";

export default function IndMovie() {
  const { id } = useParams();
  const { data: movie, dataLoaded: dataLoaded } = fetchData(id);
  const [recommendedMoviesLoaded, setRecommendedMoviesLoaded] = useState(
    false
  );

  const handleRecommendedMoviesLoaded = () => {
    setRecommendedMoviesLoaded(true);
  };

  if (!dataLoaded && !recommendedMoviesLoaded) {
    return <LoadingPage />;
  }

  const movieUrl = "https://image.tmdb.org/t/p/original";
  const movieBackdrop =
    `url(${movieUrl}${movie.backdropPath})` ||
    `url(${movieUrl}${movie.backdrop_path})`;
  const moviePosterPath = `${movieUrl}${movie.posterPath}`;

  return (
    <div className={IndMovieStyle["ind-movie-page-wrapper"]}>
      <NavBar />
      <div
        className={IndMovieStyle.background}
        style={{
          backgroundImage: movieBackdrop,
        }}
      />
      <div className={IndMovieStyle["content-wrapper"]}>
        <div className={IndMovieStyle["flex-1"]}>
          <img
            className={IndMovieStyle["hero-poster"]}
            src={moviePosterPath}
            alt="Movie Poster"
          />
        </div>
        <section className={IndMovieStyle["hero-content"]}>
          <div className={IndMovieStyle.movie__score}>
            <MovieAverage voteAverage={movie.voteAverage} />
          </div>
          <div className={IndMovieStyle.movie_hero_info_container}>
            <h2 className={IndMovieStyle.movie__title}>{movie.title}</h2>
            <div className={IndMovieStyle.movie__year}>
              <ParseDate date={movie.releaseDate} />
            </div>
            <MovieGenres genres={movie.genres} />
            <div className={IndMovieStyle.movie__description}>
              {movie.overview}
            </div>
            {movie.video ?
              <div className={IndMovieStyle["btn-wrapper"]}>
                <MovieButton
                  innerIcon="trailer"
                  onClick={() => MovieTrailer(movie.video[0])}
                />
              </div>
              : null}
          </div>


          <div className={IndMovieStyle.ind_movie_review}>
            <UserMovieReviews
              movieId={movie.id}
              placement="header"
            />
          </div>
        </section>
        <section className={IndMovieStyle.mainContainer}>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-1"]}`}>
            <MovieDetails
              runtime={movie.runtime}
              revenue={movie.revenue}
              budget={movie.budget}
              voteCount={movie.voteCount}
              language={movie.originalLanguage}
              productionCompanies={movie.productionCompanies}
              movieStatus={movie.movieStatus}
              releaseDate={movie.releaseDate}
            />
          </div>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-2"]}`}>
            <EmbeddedMovieTrailer video={movie.video} />
          </div>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-3"]}`}>
            <UserMovieReviews
              voteAverage={movie.voteAverage}
              movieId={movie.id}
              placement="userRatingSection"
            />
          </div>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-4"]}`}>
            <div className={ActorCarouselStyle.CastMembers}>
              <MovieActors actors={movie.actors} />
            </div>
          </div>
        </section>

        <div className={`${IndMovieStyle["recommended-carousel-wrapper"]}`}>
          <RecommendedCarousel
            movieId={movie.id}
            onRecommendedMoviesLoad={handleRecommendedMoviesLoaded}
          />
        </div>
      </div>
    </div >
  );
}
