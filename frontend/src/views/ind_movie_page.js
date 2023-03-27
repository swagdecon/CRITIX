import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../components/ind_movie/ind_movie.css";
import "font-awesome/css/font-awesome.min.css";
import Container from "../components/Container/Container";
import ReactPlayer from "react-player";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  getYearFromDate,
  MovieActors,
  MovieReviews,
} from "../components/movieCardfunctions";
import Popcorn from "../misc/popcorn_logo";
import "../misc/popcorn_logo.css";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BsWallet2 } from "react-icons/bs";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
const IndMovie = () => {
  const [movie, setMovie] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false); // new state
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const myResponse = await fetch(`${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });

        if (myResponse.ok) {
          const responseData = await myResponse.json();
          setMovie(responseData);
          setDataLoaded(true);
        } else {
          console.log(`HTTP error! status: ${myResponse.status}`);
          navigate("/403", { replace: true });
        }
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
      <Container />
      <body>
        <div
          className="background"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path}) `,
          }}
        ></div>
        <ind-movie-body>
          <div className="ind-movie-wrapper">
            <div className="hero-poster" style={{ marginTop: 40 }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              />
            </div>

            <div id="fade" className="container-margin">
              <div className="ind-movie-header ">
                <div className="movie__score">
                  {MovieAverage(movie.vote_average)}
                </div>
                <div className="movie__title__container">
                  <h2 className="movie__title">{movie.title}</h2>
                  <div className="movie__year">
                    {getYearFromDate(movie.release_date)}
                  </div>
                </div>
                <MovieGenres genres={movie.genres} />
                <p className="movie__description">{movie.overview}</p>

                <div className="btn-wrapper">
                  <button
                    type="submit"
                    onClick={() => MovieTrailer(movie.video[0])}
                    className="css-button"
                    style={{ right: "40.5%", marginTop: "2%" }}
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
                    <section className="movieDetailsContainer">
                      <div className="ind-movie-details-card">
                        <div className="card-overlay">
                          <div className="movie-Details-Title">
                            Movie Details
                          </div>
                          <div className="movie-details-list">
                            <div className="ind_movie_watch_providers"></div>
                            <div className="ind_movie_runtime">
                              <div className="ind_movie_details_title">
                                Runtime
                              </div>
                              <AiOutlineClockCircle size={50} />
                              <div className="movie_info_text">
                                {movie.runtime} minutes
                              </div>
                            </div>
                            <div className="ind_movie_revenue">
                              <div className="ind_movie_details_title">
                                Revenue
                              </div>
                              <RiMoneyDollarBoxFill size={50} />
                              <div className="movie_info_text">
                                ${movie.revenue}
                              </div>
                            </div>
                            <div className="ind_movie_budget">
                              <div className="ind_movie_details_title">
                                Budget
                              </div>
                              <BsWallet2 size={50} />
                              <div className="movie_info_text">
                                ${movie.budget}
                              </div>
                            </div>
                            <div className="ind_movie_language">
                              <div className="ind_movie_details_title">
                                Language
                              </div>
                              <FaLanguage size={50} />
                              <div className="movie_info_text">
                                {movie.original_language}
                              </div>
                            </div>
                            <div className="ind_movie_production_company"></div>
                            <div className="ind_movie_status"></div>
                          </div>
                        </div>
                      </div>
                    </section>
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
          </div>
        </ind-movie-body>
      </body>
    </html>
  );
};

export default IndMovie;
