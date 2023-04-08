import { React, useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  MovieRuntime,
  MovieAverage,
  TruncateDescription,
  MovieCardGenres,
  MovieCardActors,
} from "../../movieComponents.js";
import PropTypes from "prop-types";
import "./MovieCarousel.css";
import { chunk } from "lodash";
import { useNavigate } from "react-router-dom";
import "../title.scss";
import MovieCardStyle from "../../../misc/moviecard.module.scss";

export default function MovieCarousel({ title, endpoint }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const movieChunks = chunk(movies, 5);

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

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });
        setMovies(response.data);
      } catch (error) {
        navigate("/403", { replace: true });
        console.log(error);
      }
    }

    fetchData();
  }, [endpoint]);

  return (
    <section>
      <h3-title>{title}</h3-title>
      <Carousel className="carousel-movie" indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div
                className={MovieCardStyle["card-container"]}
                key={`${i}-${j}`}
              >
                <Link to={`${endpoint}/${movie.id}`}>
                  <div className="container">
                    <div className={MovieCardStyle["cellphone-container"]}>
                      <div className={MovieCardStyle.movie}>
                        <div className={MovieCardStyle.menu}>
                          <i className="material-icons"></i>
                        </div>
                        <div
                          className={MovieCardStyle["movie-img"]}
                          style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.posterPath})`,
                          }}
                        ></div>
                        <div className={MovieCardStyle["text-movie-cont"]}>
                          <div className={MovieCardStyle["mr-grid"]}>
                            <div className={MovieCardStyle.col1}>
                              <ul className={MovieCardStyle["movie-gen"]}>
                                <li>
                                  <MovieAverage
                                    voteAverage={movie.voteAverage}
                                  />
                                </li>
                                <li>
                                  <MovieRuntime runtime={movie.runtime} />
                                </li>
                                <li>
                                  <MovieCardGenres genres={movie.genres} />
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div
                            className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["summary-row"]}`}
                          >
                            <div className={MovieCardStyle.col2}>
                              <h5>SUMMARY</h5>
                            </div>
                            <div className={MovieCardStyle.col2}>
                              <ul className={MovieCardStyle["movie-likes"]}>
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
                          <div className={MovieCardStyle["mr-grid"]}>
                            <div className={MovieCardStyle.col1}>
                              <p
                                className={MovieCardStyle["movie-description"]}
                              >
                                <TruncateDescription
                                  description={movie.overview}
                                />
                              </p>
                            </div>
                          </div>
                          <div
                            className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["actors-row"]}`}
                          >
                            <div className={MovieCardStyle.col1}>
                              <p className={MovieCardStyle["movie-actors"]}>
                                <MovieCardActors actors={movie.actors} />
                              </p>
                            </div>
                          </div>
                          <div
                            className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["action-row"]}`}
                          >
                            <div className={MovieCardStyle.col2}>
                              <button
                                className={MovieCardStyle["watch-btn"]}
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
                            <div
                              className={`${MovieCardStyle["col6"]} ${MovieCardStyle["action-btn"]}`}
                            >
                              <i className="material-icons">&#xE161;</i>
                            </div>
                            <div
                              className={`${MovieCardStyle["col6"]} ${MovieCardStyle["action-btn"]}`}
                            >
                              <i className="material-icons">&#xE866;</i>
                            </div>
                            <div
                              className={`${MovieCardStyle["col6"]} ${MovieCardStyle["action-btn"]}`}
                            >
                              <i className="material-icons">&#xE80D;</i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}
