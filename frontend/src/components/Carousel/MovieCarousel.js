import { React, useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import truncateDescription from "../movieCardfunctions.js";
import PropTypes from "prop-types";
import "./MovieCarousel.css";
// Library that can perform array manipulation, in this case, splitting the movie into chunks of 5 to then loop over:
import { chunk } from "lodash";
import { useNavigate } from "react-router-dom";
import "./title.scss";
import "../../misc/moviecard.scss";
const MovieCarousel = ({ title, endpoint }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const movieChunks = chunk(movies, 5);
  //The chunk() method takes two arguments: the first argument is the array to be chunked, and the second argument (optional) is the size of each chunk. In this case, we pass 5 as the size of each chunk.

  // The chunk() method returns an array of sub-arrays, where each sub-array contains 5 movies or less. We then use the same map() method as before to render the carousel slides and movie cards.
  MovieCarousel.propTypes = {
    title: PropTypes.string.isRequired,
  };
  MovieCarousel.propTypes = {
    flickerL: PropTypes.string.isRequired,
  };
  MovieCarousel.propTypes = {
    endpoint: PropTypes.string.isRequired,
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const myResponse = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });

        if (myResponse.ok) {
          const responseJson = await myResponse.json();
          setMovies(responseJson);
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
  }, [endpoint]);

  return (
    <body-1>
      <h3-title>{title}</h3-title>
      <Carousel className="carousel-movie" indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div className="card-container" key={`${i}-${j}`}>
                <div className="container">
                  <div className="cellphone-container">
                    <div className="movie">
                      <div className="menu">
                        <i className="material-icons"></i>
                      </div>
                      <div
                        className="movie-img"
                        style={{
                          backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`,
                        }}
                      ></div>
                      <div className="text-movie-cont">
                        <div className="mr-grid">
                          <div className="col1">
                            {/* .replace ensures there is only one space inbetween words */}
                            {/* <h1>{movie.title.replace(/\s+/g, " ")}</h1> */}
                            <ul className="movie-gen">
                              <li>
                                {Math.round(movie.vote_average * 10) / 10}{" "}
                              </li>
                              <li>{movie.runtime} mins</li>
                              <li>{movie.genres.join(", ")}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mr-grid summary-row">
                          <div className="col2">
                            {/* <h2>{movie.title}</h2> */}
                            {/* <p>{movie.release_date}</p> */}
                            {/* <p>{movie.tagline}</p> */}
                            <h5>SUMMARY</h5>
                          </div>
                          <div className="col2">
                            <ul className="movie-likes">
                              <li>
                                <i className="material-icons">&#xE813;</i>
                                124
                              </li>
                              <li>
                                <i className="material-icons">&#xE813;</i>3
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="mr-grid">
                          <div className="col1">
                            <p className="movie-description">
                              {truncateDescription(movie.overview)}
                            </p>
                          </div>
                        </div>
                        <div className="mr-grid actors-row">
                          <div className="col1">
                            <p className="movie-actors">
                              {movie.actors.slice(0, 3).map((actor, index) => {
                                if (index === 0) {
                                  return actor;
                                } else if (index < 3) {
                                  return `, ${actor}`;
                                } else {
                                  return "";
                                }
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="mr-grid action-row">
                          <div className="col2">
                            <button
                              className="watch-btn"
                              type="button"
                              onClick={() =>
                                (window.location.href = `https://www.youtube.com/watch?v=${movie.video[0]}`)
                              }
                            >
                              <h3>
                                <i className="material-icons">&#xE037;</i>
                                WATCH TRAILER
                              </h3>
                            </button>
                          </div>
                          <div className="col6 action-btn">
                            <i className="material-icons">&#xE161;</i>
                          </div>
                          <div className="col6 action-btn">
                            <i className="material-icons">&#xE866;</i>
                          </div>
                          <div className="col6 action-btn">
                            <i className="material-icons">&#xE80D;</i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
    </body-1>
  );
};

export default MovieCarousel;
