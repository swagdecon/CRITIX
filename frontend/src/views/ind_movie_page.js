import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../components/ind_movie/ind_movie.css";
import Container from "../components/Container/Container";
import ReactPlayer from "react-player";
import {
  MovieGenres,
  MovieTrailer,
  MovieAverage,
  getYearFromDate,
} from "../components/movieCardfunctions";
import Popcorn from "../misc/popcorn_logo";
import "../misc/popcorn_logo.css";
const IndMovie = () => {
  const [movie, setMovie] = useState({});
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
        } else {
          console.log(`HTTP error! status: ${myResponse.status}`);
          navigate("/403", { replace: true });
        }
      } catch (error) {
        navigate("/403", { replace: true });
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <html>
      <Container />
      <body>
        <div
          className="background"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.backdrop_path}) `,
          }}
        ></div>
        <ind-movie-body>
          <div className="ind-movie-wrapper">
            <div className="hero-poster" style={{ marginTop: 40 }}>
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
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
                <ul>
                  <li>
                    <div className="review__score">95%</div>
                    <p className="review__description">
                      &quot;Ex Machina&quot; deals with a familiar theme in a
                      very unique way. It doesn&apos;t bombard you with effects
                      or superficial action (although the robot effects are
                      exceptional). Rather, its focus and beauty lie in the
                      subtle and nuanced performances of its tiny cast as the
                      film explores what it means to be human.
                    </p>
                  </li>
                  <li>
                    <div className="review__score">91%</div>
                    <p className="review__description">
                      Quiet dialogue scenes between two characters are filmed in
                      such an impactful, making them feel hauntingly austere,
                      sweet and innocent, or terrible and frightening, through
                      meticulous use of composition, light and sound. The film
                      really does run the gamut of emotions, surprisingly funny
                      one minute and gut-wrenchingly tense and weird the next,
                      while the script twists and turns, constantly unsettling
                      your assumptions about what will happen.
                    </p>
                  </li>
                  <li>
                    <div className="review__score">89%</div>
                    <p className="review__description">
                      The performances are excellent, most notably Alicia
                      Vikander as the beguiling Ava, who absolutely passes for
                      being &apos;almost human &apos;. Her precise movements
                      -walking, standing or stooping to pull on a pair of
                      stockings- have just that slight tinge of the uncanny
                      about them to suggest a mechanical skeleton, yet she is
                      undeniably seductive. You can really understand Caleb
                      &apos;s mental plight as she begins to show signs of a
                      sexual interest in him!
                    </p>
                  </li>
                </ul>
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
                      width={"1500px"}
                      height={"750px"}
                    />
                    <img
                      className="ind-movie-poster"
                      src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    />
                  </div>
                  <h1>Cast Members:</h1>
                  <section className="CastMembers">
                    <div className="profile-container">
                      <div className="card card0">
                        <div className="border">
                          <h3 className="profile-person">Al Pacino</h3>
                          <div className="icons">
                            <i className="fa fa-codepen" aria-hidden="true"></i>
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-dribbble"
                              aria-hidden="true"
                            ></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="card card1">
                        <div className="border">
                          <h3 className="profile-person">Ben Stiller</h3>
                          <div className="icons">
                            <i className="fa fa-codepen" aria-hidden="true"></i>
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-dribbble"
                              aria-hidden="true"
                            ></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="card card2">
                        <div className="border">
                          <h3 className="profile-person">Patrick Stewart</h3>
                          <div className="icons">
                            <i className="fa fa-codepen" aria-hidden="true"></i>
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-dribbble"
                              aria-hidden="true"
                            ></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                      <div className="card card3">
                        <div className="border">
                          <h3 className="profile-person">Emma Stone</h3>
                          <div className="icons">
                            <i className="fa fa-codepen" aria-hidden="true"></i>
                            <i
                              className="fa fa-instagram"
                              aria-hidden="true"
                            ></i>
                            <i
                              className="fa fa-dribbble"
                              aria-hidden="true"
                            ></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                            <i
                              className="fa fa-facebook"
                              aria-hidden="true"
                            ></i>
                          </div>
                        </div>
                      </div>
                    </div>
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
