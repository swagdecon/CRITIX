import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IndMovieStyle from "../components/IndMovie/ind_movie.module.css";
import ActorStyle from "../components/Carousel/ActorCarousel/ActorCarousel.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import MovieReviews from "../components/Review/MovieReviews";
import backupPoster from "../misc/noPosterAvailable.png"
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  ParseYear,
  EmbeddedMovieTrailer,
  MovieDetails,
} from "../components/IndMovie/MovieComponents";
import RecommendedCarousel from "../components/Carousel/RecommendedCarousel/RecommendedCarousel";
import MovieActors from "../components/Carousel/ActorCarousel/ActorCarousel";
import LoadingPage from "./LoadingPage";
import MovieButton from "../components/Other/btn/MovieButton/Button";
import fetchData from "../security/FetchApiData";
import isTokenExpired from "../security/IsTokenExpired.js";
const recommendedEndpoint = process.env.REACT_APP_RECOMMENDED_ENDPOINT;

export default function IndMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [recommendedMovies, setRecommendedMovies] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const handleTrailerClick = () => MovieTrailer(movie.trailer)
  useEffect(() => {
    async function fetchBackendData() {
      setIsLoading(true);
      try {
        await isTokenExpired();
        const [movies, reviewsData, recommendedMovies] = await Promise.all([
          fetchData(id),
          fetchData(`http://localhost:8080/review/${id}`),
          fetchData(`${recommendedEndpoint}${id}`)
        ]);

        setMovie(movies);
        setReviews(reviewsData)
        setRecommendedMovies(recommendedMovies)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBackendData();
  }, [id]);

  return isLoading || !movie ? (
    <LoadingPage />
  ) : (
    <div className={IndMovieStyle["ind-movie-page-wrapper"]}>
      <NavBar />
      <div
        className={IndMovieStyle.background}
        style={{
          backgroundImage: `url(${movie.backdropUrl})`,
        }}
      />
      <div className={IndMovieStyle["content-wrapper"]}>
        <section className={IndMovieStyle["hero-content"]}>
          <div className={IndMovieStyle.movie_hero_info_container}>
            <div className={IndMovieStyle.movie__score}>
              <MovieAverage voteAverage={movie.voteAverage} />
            </div>
            <h2 className={IndMovieStyle.movie__title}>{movie.title}</h2>
            <div className={IndMovieStyle.movie__year}>
              <ParseYear date={movie.releaseDate} />
            </div>
            <MovieGenres genres={movie.genres} />
            <div className={IndMovieStyle.movie__description}>
              {movie.overview}
            </div>
            {movie.trailer ? (
              <div className={IndMovieStyle["btn-wrapper"]}>
                <MovieButton
                  innerIcon="trailer"
                  onClick={handleTrailerClick}
                />
              </div>
            ) : null}
            <div className={IndMovieStyle.ind_movie_review}>
              <MovieReviews movieId={movie.id} reviews={reviews} placement="header" />
            </div>
          </div>

          {movie.posterUrl ?
            <div className={IndMovieStyle["flex-1"]}>
              <img
                className={IndMovieStyle["hero-poster"]}
                src={movie.posterUrl}
                alt="Movie Poster"
              />
            </div>
            : <img
              className={IndMovieStyle["hero-poster"]}
              src={backupPoster}
              alt="fallback poster"
            />}
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
            <EmbeddedMovieTrailer trailer={movie.trailer} />
          </div>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-3"]}`}>
            <MovieReviews
              voteAverage={movie.voteAverage}
              movieId={movie.id}
              reviews={reviews}
              placement="userRatingSection"
            />
          </div>
          {movie.actors.length > 0 ?
            <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-4"]}`}>
              <div className={ActorStyle.CastMembers}>
                <MovieActors actors={movie.actors} />
              </div>
            </div>
            : null}
        </section>
        {recommendedMovies.length >= 4 ?
          <div className={`${IndMovieStyle["recommended-carousel-wrapper"]}`}>
            <RecommendedCarousel
              recommendedMovies={recommendedMovies}
            />
          </div>
          : null}
      </div>
    </div>
  );
}
