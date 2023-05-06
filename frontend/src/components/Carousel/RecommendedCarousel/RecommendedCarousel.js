import { React, useEffect, useState } from "react";
import getRecommendations from "../../../axios/getRecommendations";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { chunk } from "lodash";
import MovieCardStyle from "../../../misc/moviecard.module.scss";
import PropTypes from "prop-types";
import {
  TruncateDescription,
  MovieRuntime,
  MovieAverage,
} from "../../Other/movieComponents";
import {
  MovieCardActors,
  MovieCardGenres,
} from "../../Other/MovieCardComponents.js";
export default function RecommendedCarousel({ movieId }) {
  const [recommendations, setRecommendations] = useState([]);
  const movieChunks = chunk(recommendations, 5);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const data = await getRecommendations(movieId);
      setRecommendations(data);
    };
    fetchRecommendations();
  }, [movieId]);
  if (!recommendations) {
    return;
  }
  return (
    <Carousel className="carousel-movie" indicators={false} interval={null}>
      {movieChunks.map((chunk, i) => (
        <Carousel.Item key={i}>
          {chunk.map((movie, j) => (
            <div
              className={MovieCardStyle["recommended-card-container"]}
              key={`${i}-${j}`}
            >
              <Link to={`/movies/movie/${movie.id}`}>
                <div className="container">
                  <div className={MovieCardStyle["cellphone-container"]}>
                    <div className={MovieCardStyle.movie}>
                      <div className={MovieCardStyle.menu}>
                        <i className="material-icons"></i>
                      </div>
                      <div
                        className={MovieCardStyle["movie-img"]}
                        style={{
                          backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`,
                        }}
                      ></div>
                      <div className={MovieCardStyle["text-movie-cont"]}>
                        <div className={MovieCardStyle["mr-grid"]}>
                          <div className={MovieCardStyle.col1}>
                            <ul className={MovieCardStyle["movie-gen"]}>
                              <li>
                                <MovieAverage
                                  voteAverage={movie.vote_average}
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
                            <p className={MovieCardStyle["movie-description"]}>
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
  );
}
RecommendedCarousel.propTypes = {
  movieId: PropTypes.number,
};
