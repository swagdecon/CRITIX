import React from "react";
import { useParams } from "react-router-dom";
import IndMovieStyle from "../components/IndMovie/ind_movie.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  GetYearFromDate,
  EmbeddedMovieTrailer,
  MovieReviews,
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

  if (!dataLoaded) {
    return <LoadingPage />;
  }
  let movieBackdrop =
    `url(https://image.tmdb.org/t/p/original${movie.backdropPath}) ` ||
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  let moviePosterPath = `https://image.tmdb.org/t/p/original${movie.posterPath}`;
  console.log(movie);

  return (
    <div className={IndMovieStyle["ind-movie-page-wrapper"]}>
      <NavBar />
      <div
        className={IndMovieStyle.background}
        style={{
          backgroundImage: movieBackdrop,
        }}
      ></div>
      <div>
        <ind-movie-body>
          <div className={IndMovieStyle["ind-movie-wrapper"]}>
            <div className={IndMovieStyle["hero-poster"]}>
              <img src={moviePosterPath} />
            </div>
            <div id="fade" className={IndMovieStyle["container-margin"]}>
              <div className={IndMovieStyle["ind-movie-header"]}>
                <div className={IndMovieStyle.movie__score}>
                  <MovieAverage voteAverage={movie.voteAverage} />
                </div>
                <div className={IndMovieStyle.movie__title__container}>
                  <h2 className={IndMovieStyle.movie__title}>{movie.title}</h2>
                  <div className={IndMovieStyle.movie__year}>
                    {GetYearFromDate(movie.releaseDate)}
                  </div>
                </div>
                <MovieGenres genres={movie.genres} />
                <p className={IndMovieStyle.movie__description}>
                  {movie.overview}
                </p>

                <div className={IndMovieStyle["btn-wrapper"]}>
                  <MovieButton
                    innerIcon="trailer"
                    onClick={() => MovieTrailer(movie.video[0])}
                  />
                </div>
              </div>
              <div className={IndMovieStyle.ind_movie_review}>
                <h3 className={IndMovieStyle.ind_review__title}>Reviews</h3>
                <MovieReviews reviews={movie.reviews} />
              </div>
            </div>
            <section id="slide-1" className={IndMovieStyle.homeSlide}>
              <div className={IndMovieStyle.bcg}>
                <div className={IndMovieStyle.hsContainer}>
                  <div
                    className={IndMovieStyle.hsContent}
                    data-center="opacity: 1"
                    data-top="opacity: 0"
                    data-anchor-target="#slide-1 h2"
                  >
                    <EmbeddedMovieTrailer video={movie.video} />
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
                  <h1 className={IndMovieStyle["cast-title-1"]}>
                    Cast Members:
                  </h1>
                  <section className={IndMovieStyle.CastMembers}>
                    <MovieActors actors={movie.actors} />
                  </section>
                </div>
              </div>
            </section>
            <section className={IndMovieStyle.recommended_movies}>
              <RecommendedCarousel movieId={movie.id} />
            </section>
          </div>
        </ind-movie-body>
      </div>
    </div>
  );
}
