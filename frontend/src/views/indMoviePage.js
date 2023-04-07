import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../components/IndMovie/ind_movie.css";
import "font-awesome/css/font-awesome.min.css";
import Container from "../components/Container/Container";
import ReactPlayer from "react-player";
import axios from "axios";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  getYearFromDate,
  MovieActors,
  MovieReviews,
  MovieDetails,
  RecommendedCarousel,
} from "../components/movieComponents";
import Popcorn from "../misc/popcorn_logo";
import "../misc/popcorn_logo.css";

const IndMovie = () => {
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
      <body>
        <Container />
        <div
          className="background"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdropPath}) `,
          }}
        ></div>
        <ind-movie-body>
          <div className="ind-movie-wrapper">
            <div className="hero-poster">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.posterPath}`}
              />
            </div>

            <div id="fade" className="container-margin">
              <div className="ind-movie-header ">
                <div className="movie__score">
                  <MovieAverage voteAverage={movie.voteAverage} />
                </div>
                <div className="movie__title__container">
                  <h2 className="movie__title">{movie.title}</h2>
                  <div className="movie__year">
                    {getYearFromDate(movie.releaseDate)}
                  </div>
                </div>
                <MovieGenres genres={movie.genres} />
                <p className="movie__description">{movie.overview}</p>

                <div className="btn-wrapper">
                  <button
                    type="submit"
                    onClick={() => MovieTrailer(movie.video[0])}
                    className="css-button trailer-btn"
                  >
                    <p className="css-button-text">WATCH TRAILER</p>
                    <div className="css-button-inner">
                      <div className="reset-skew">
                        <Popcorn className="css-button-inner-text"></Popcorn>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              <div className="ind_movie_review">
                <h3 className="ind_review__title">Reviews</h3>
                <MovieReviews reviews={movie.reviews} />
              </div>
            </div>
            <section id="slide-1" className="homeSlide">
              <div
                className="bcg"
                data-center="background-position: 50% 0px;"
                data-top-bottom="background-position: 50% -100px;"
                data-anchor-target="#slide-1"
              >
                <div className="hsContainer">
                  <div
                    className="hsContent"
                    data-center="opacity: 1"
                    data-top="opacity: 0"
                    data-anchor-target="#slide-1 h2"
                  >
                    <ReactPlayer
                      className="indMovieEmbeddedTrailer"
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
                  <h1 className="cast-title-1">Cast Members:</h1>
                  <section className="CastMembers">
                    <MovieActors
                      actors={movie.actors}
                      images={movie.actorImagePaths}
                    />
                  </section>
                </div>
              </div>
            </section>
            <section className="recommended_movies">
              <RecommendedCarousel movieId={movie.id} />
            </section>
          </div>
        </ind-movie-body>
      </body>
    </html>
  );
};

export default IndMovie;
