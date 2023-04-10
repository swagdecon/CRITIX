import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import IndMovieStyle from "../components/IndMovie/ind_movie.module.css";
import "font-awesome/css/font-awesome.min.css";
import Container from "../components/Container/Container";
import ReactPlayer from "react-player";
import axios from "axios";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  getYearFromDate,
  MovieReviews,
  MovieDetails,
} from "../components/movieComponents";
import RecommendedCarousel from "../components/Carousel/RecommendedCarousel/RecommendedCarousel";
import MovieActors from "../components/Carousel/ActorCarousel/ActorCarousel";
import Popcorn from "../misc/popcorn_logo";
import "../misc/popcorn_logo.css";
import SignUpStyles from "../components/Login/login.module.css";

export default function IndMovie() {
  const [movie, setMovie] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const response = await axios.get(`${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });
        setMovie(response.data);
        setDataLoaded(true);
      } catch (error) {
        navigate("/403", { replace: true });
        console.log(error);
      }
    }

    if (!requestSent) {
      // check if request has been sent before
      fetchData();
      setRequestSent(true); // set state to indicate that request has been sent
    }
  }, [requestSent, id, navigate]);

  if (!dataLoaded) {
    return <div>Loading...</div>;
  }
  let movieBackdrop = `url(https://image.tmdb.org/t/p/original${movie.backdropPath}) `;
  let moviePosterPath = `https://image.tmdb.org/t/p/original${movie.posterPath}`;
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <Container />
      <div
        className={IndMovieStyle.background}
        style={{
          backgroundImage: movieBackdrop,
        }}
      ></div>
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
                  {getYearFromDate(movie.releaseDate)}
                </div>
              </div>
              <MovieGenres genres={movie.genres} />
              <p className={IndMovieStyle.movie__description}>
                {movie.overview}
              </p>

              <div className={IndMovieStyle["btn-wrapper"]}>
                <button
                  type="submit"
                  onClick={() => MovieTrailer(movie.video[0])}
                  className={SignUpStyles["css-button"]}
                >
                  <p className={SignUpStyles["css-button-text"]}>
                    WATCH TRAILER
                  </p>
                  <div className={SignUpStyles["css-button-inner"]}>
                    <div className={SignUpStyles["reset-skew"]}>
                      <Popcorn
                        className={SignUpStyles["css-button-inner-text"]}
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className={IndMovieStyle.ind_movie_review}>
              <h3 className={IndMovieStyle.ind_review__title}>Reviews</h3>
              <MovieReviews reviews={movie.reviews} />
            </div>
          </div>
          <section id="slide-1" className={IndMovieStyle["homeSlide"]}>
            <div
              className={IndMovieStyle.bcg}
              data-center="background-position: 50% 0px;"
              data-top-bottom="background-position: 50% -100px;"
              data-anchor-target="#slide-1"
            >
              <div className={IndMovieStyle.hsContainer}>
                <div
                  className={IndMovieStyle.hsContent}
                  data-center="opacity: 1"
                  data-top="opacity: 0"
                  data-anchor-target="#slide-1 h2"
                >
                  <ReactPlayer
                    className={IndMovieStyle.indMovieEmbeddedTrailer}
                    url={`https://www.youtube.com/watch?v=${movie.video}`}
                    controls={true}
                    playing={false}
                    width={"1500px"}
                    height={"750px"}
                  />
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
                <h1 className={IndMovieStyle["cast-title-1"]}>Cast Members:</h1>
                <section className={IndMovieStyle.CastMembers}>
                  <MovieActors
                    actors={movie.actors}
                    images={movie.actorImagePaths}
                  />
                </section>
              </div>
            </div>
          </section>
          <section className={IndMovieStyle.recommended_movies}>
            <RecommendedCarousel movieId={movie.id} />
          </section>
        </div>
      </ind-movie-body>
    </html>
  );
}
