import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IndMovieStyle from "../components/IndMovie/ind_movie.module.css";
import "font-awesome/css/font-awesome.min.css";
import NavBar from "../components/NavBar/NavBar.js";
import axios from "axios";
import Cookies from "js-cookie";
import isExpired from "../components/Other/IsTokenExpired.js";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  GetYearFromDate,
  EmbeddedMovieTrailer,
  MovieReviews,
  MovieDetails,
} from "../components/Other/MovieComponents";
import RecommendedCarousel from "../components/Carousel/RecommendedCarousel/RecommendedCarousel";
import MovieActors from "../components/Carousel/ActorCarousel/ActorCarousel";
import LoadingPage from "./LoadingPage";
import MovieButton from "../components/Other/btn/Button";

export default function IndMovie() {
  const [movie, setMovie] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        let token = Cookies.get("accessToken");

        const response = await axios.get(id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMovie(response.data);
        setDataLoaded(true);
      } catch (error) {
        await isExpired();
        try {
          // Token expired, get a new token and retry the request

          let newAccessToken = Cookies.get("accessToken");
          const response = await axios.get(id, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          setMovie(response.data);
          setDataLoaded(true);
        } catch (error) {
          navigate("/403", { replace: true });
          console.log(error);
        }
      }
    }
    if (prevId !== id) {
      // compare current url id with previous url id
      setRequestSent(false); // reset requestSent state variable
      setDataLoaded(false); // reset dataLoaded state variable
      setPrevId(id); // update previous id state variable
    }

    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, id, navigate, prevId]); // add prevId as a dependency

  if (!dataLoaded) {
    return <LoadingPage />;
  }
  let movieBackdrop =
    `url(https://image.tmdb.org/t/p/original${movie.backdropPath}) ` ||
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  let moviePosterPath = `https://image.tmdb.org/t/p/original${movie.posterPath}`;
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
                      language={movie.original_language}
                      productionCompanies={movie.productionCompanies}
                      movieStatus={movie.status}
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
