import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import IndMovieStyle from "../components/IndMovie/IndMovie.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import MovieReviews from "../components/Review/MovieReviews";
import backupPoster from "../misc/noPosterAvailable.png"
import {
  MovieGenres,
  WatchMovieNow,
  MovieAverage,
  ParseYear,
  EmbeddedMovieTrailer,
  MovieDetails,
} from "../components/IndMovie/MovieComponents";
import RecommendedCarousel from "../components/Carousel/RecommendedCarousel/RecommendedCarousel";
// import MovieActors from "../components/Carousel/ActorCarousel/ActorCarousel";
import LoadingPage from "./LoadingPage";
import MovieButton from "../components/Other/btn/MovieButton/Button";
import { fetchData, sendData } from "../security/Data";
import isTokenExpired from "../security/IsTokenExpired.js";
import WatchListBtn from "..//components/Other/btn/WatchListBtn/WatchListBtn";
import FavouriteBtn from "../components/Other/btn/FavouriteBtn/FavouriteBtn.js";
const recommendedEndpoint = process.env.REACT_APP_RECOMMENDED_ENDPOINT;
const getReviewEndpoint = process.env.REACT_APP_GET_REVIEW_ENDPOINT

export default function IndMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState(null)
  const [recommendedMovies, setRecommendedMovies] = useState(null)
  const [isLoading, setIsLoading] = useState(true);

  const handleWatchNowClick = () => WatchMovieNow(movie.providerResults)
  useEffect(() => {
    async function fetchBackendData() {
      setIsLoading(true);
      try {
        await isTokenExpired();
        const [movies, reviewsData, recommendedMovies] = await Promise.all([
          sendData(id),
          fetchData(`${getReviewEndpoint}${id} `),
          fetchData(`${recommendedEndpoint}${id} `)
        ]);
        setMovie(await movies.json());
        setReviews(reviewsData)
        setRecommendedMovies(recommendedMovies)
      } catch (error) {
        console.error("Error fetching data:", await error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBackendData();
  }, [id]);

  const containerClass = movie && movie.trailer
    ? IndMovieStyle.mainContainer
    : `${IndMovieStyle.mainContainer} ${IndMovieStyle.NoTrailerContainer}`;

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
            <div className={IndMovieStyle.rating}>
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
            <div className={IndMovieStyle["btn-wrapper"]}>
              <MovieButton
                innerIcon="watchNow"
                onClick={handleWatchNowClick}
              />
              <div className={IndMovieStyle.BtnResponsive}>
                <div className={IndMovieStyle["btn-wrapper-el"]}>
                  <WatchListBtn movieData={movie} outline={true} />
                </div>
                <div className={IndMovieStyle["btn-wrapper-el"]}>
                  <FavouriteBtn movieData={movie} outline={true} />
                </div>
              </div>
            </div>
          </div>
          {movie.posterUrl ?
            <img
              className={IndMovieStyle["hero-poster"]}
              src={movie.posterUrl}
              alt="Movie Poster"
            />
            : <img
              className={IndMovieStyle["hero-poster"]}
              src={backupPoster}
              alt="fallback poster"
            />}
        </section>
        <section className={containerClass}>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-1"]} `}>
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
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-2"]} `}>
            <EmbeddedMovieTrailer trailer={movie.trailer} />
          </div>
          <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-3"]} `}>
            <MovieReviews
              movieId={movie.id}
              movieTitle={movie.title}
              reviews={reviews}
              placement="userRatingSection"
            />
          </div>
          {/* {movie.actors && movie.actors.length > 0 ?
            <div className={`${IndMovieStyle["grid-item"]} ${IndMovieStyle["grid-item-4"]} `}>
              <MovieActors actors={movie.actors} />
            </div>
            : null} */}
        </section>
        {recommendedMovies.length >= 4 ?
          <div className={`${IndMovieStyle["recommended-carousel-wrapper"]} `}>
            <RecommendedCarousel
              recommendedMovies={recommendedMovies}
            />
          </div>
          : null}
      </div>
    </div>
  );
}
