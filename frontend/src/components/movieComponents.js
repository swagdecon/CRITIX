import { React, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./IndMovie/ind_movie.css";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BsWallet2 } from "react-icons/bs";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlineMovie, MdDateRange } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";
import { chunk } from "lodash";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import getRecommendations from "../axios/getRecommendations";
import "../components/Carousel/MovieCarousel/MovieCarousel.css";
import MovieCardStyle from "../misc/moviecard.module.scss";
function TruncateDescription({ description }) {
  const words = description.split(" ");

  if (words.length > 30) {
    if (!words || words === null || words.length === 0) {
      return "No Description Available";
    }
    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
}

function MovieRuntime({ runtime }) {
  if (!runtime) {
    return "No Runtime Available";
  }
  return `${runtime} mins`;
}

function getYearFromDate(dateString) {
  if (!dateString) {
    return null;
  }
  const year = dateString.split("-")[0];
  return year;
}
function MovieTrailer(url) {
  if (!url) {
    return;
  }
  return window.open(`https://www.youtube.com/watch?v=${url}`);
}

function MovieAverage({ voteAverage }) {
  if (!voteAverage) {
    return "No Rating";
  }
  let rating = parseFloat(voteAverage).toFixed(1);
  return rating;
}

function MovieGenres({ genres }) {
  if (!genres) {
    return "";
  }
  MovieGenres.propTypes = {
    genres: PropTypes.arrayOf(PropTypes.string),
  };
  return (
    <ul className="movie__type">
      {genres.map((genre) => (
        <li key={genre}>{genre}</li>
      ))}
    </ul>
  );
}

function MovieCardGenres({ genres }) {
  if (!Array.isArray(genres)) {
    return "No genres available";
  }
  return genres.join(" | ");
}

const MovieActors = ({ actors, images }) => {
  MovieActors.propTypes = {
    actors: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
  };

  const defaultImage = `url(https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg) center center no-repeat`;
  // if (!actors) {
  //   return "Actor information unavailable";
  // }
  return (
    <div className="profile-container">
      {actors.slice(0, 4).map((actor, index) => {
        let image = images ? images[index] : null;
        let actorImage = `url(https://image.tmdb.org/t/p/w500${image}) center center no-repeat`;

        if (image === null) {
          image = defaultImage;
        }

        const style = image
          ? {
              background: actorImage,
              backgroundSize: "300px",
            }
          : {
              background: defaultImage,
            };

        return (
          <div
            key={index}
            className="card card1"
            style={style}
            onMouseEnter={(e) => {
              if (image) {
                e.currentTarget.style.background = `url(https://image.tmdb.org/t/p/w500${image}) left center no-repeat `;
                e.currentTarget.style.backgroundSize = "600px";
              }
              e.currentTarget.querySelector("h3").style.opacity = 1;
              Array.from(e.currentTarget.querySelectorAll(".fa")).forEach(
                (icon) => {
                  icon.style.opacity = 1;
                }
              );
            }}
            onMouseLeave={(e) => {
              if (image) {
                e.currentTarget.style.background = actorImage;
                e.currentTarget.style.backgroundSize = "300px";
              }
              e.currentTarget.querySelector("h3").style.opacity = 0;
              Array.from(e.currentTarget.querySelectorAll(".fa")).forEach(
                (icon) => {
                  icon.style.opacity = 0;
                }
              );
            }}
          >
            <div className="border">
              <h3 className="profile-person">{actor}</h3>
              <div className="ind-movie-cast-icons">
                <i className="fa fa-instagram" aria-hidden="true"></i>
                <i className="fa fa-twitter" aria-hidden="true"></i>
                <i className="fa fa-facebook" aria-hidden="true"></i>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function MovieCardActors({ actors }) {
  if (!Array.isArray(actors)) {
    return "No Actors Available";
  }
  MovieCardActors.propTypes = {
    actors: PropTypes.arrayOf(PropTypes.string),
  };

  const topActors = actors.slice(0, 3);
  return (
    <span>
      {topActors.map((actor, index) => {
        if (index === 0) {
          return actor;
        } else if (index < 3) {
          return `, ${actor}`;
        } else {
          return "";
        }
      })}
    </span>
  );
}

function MovieReviews({ reviews }) {
  MovieReviews.propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.string),
  };
  if (!reviews || reviews === "" || reviews == null) {
    return <div>No Reviews Available</div>;
  }
  const [maxHeight, setMaxHeight] = useState(500);

  const reviewRef = useRef(null);
  useEffect(() => {
    if (reviewRef.current) {
      const reviewHeight = reviewRef.current.offsetHeight;
      setMaxHeight(reviewHeight);
    }
  }, [reviews]);

  const TEXT_COLLAPSE_OPTIONS = {
    collapse: false,
    collapseText: "... show more",
    expandText: "show less",
    minHeight: 210,
    maxHeight: 500,
    textStyle: {
      color: "white",
      fontSize: "20px",
    },
  };

  return (
    <div className="review__wrapper">
      {reviews.slice(0, 3).map((review, index) => (
        <ReactTextCollapse
          key={index}
          options={{ ...TEXT_COLLAPSE_OPTIONS, maxHeight }}
        >
          {/* <div className="review__score">{review.rating}%</div> */}
          <p className="review__description">{review}</p>
          <br />
        </ReactTextCollapse>
      ))}
    </div>
  );
}
function MovieDetails({
  runtime,
  revenue,
  budget,
  language,
  productionCompanies,
  movieStatus,
  releaseDate,
}) {
  return (
    <section className="movieDetailsContainer">
      <div className="ind-movie-details-card">
        <div className="card-overlay">
          <div className="movie-Details-Title">Movie Details</div>
          <div className="movie-info-row">
            <ul className="movie-column">
              <ul className="ind-movie-runtime">
                <AiOutlineClockCircle className="movie-info-logo" size={50} />

                <div className="movie-info-text">
                  {runtime ? `${runtime} minutes` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className="ind-movie-revenue">
                <RiMoneyDollarBoxFill className="movie-info-logo" size={50} />
                <div className="movie-info-text">
                  {revenue ? `$${revenue}` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className="ind-movie-budget">
                <BsWallet2 className="movie-info-logo" size={50} />
                <div className="movie-info-text">
                  {budget ? `$${budget}` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className="ind-movie-language">
                <FaLanguage className="movie-info-logo" size={50} />
                <div className="movie-info-text">
                  {language ? language : "N/A"}
                </div>
              </ul>
            </ul>
            <ul className="movie-column">
              <ul className="ind-movie-production-company">
                <MdOutlineMovie className="movie-info-logo" size={50} />
                <div className="movie-info-text">
                  {productionCompanies ? productionCompanies[0] : "N/A"}
                </div>
              </ul>
              <br />
              <div className="ind-movie-status">
                <RiMovie2Line size={50} className="movie-info-logo" />
                <div className="movie-info-text">
                  {movieStatus ? movieStatus : "N/A"}
                </div>
              </div>
              <br />
              <div className="ind-movie-date">
                <MdDateRange size={50} className="movie-info-logo" />
                <div className="movie-info-text">
                  {releaseDate ? releaseDate : "N/A"}
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
MovieDetails.propTypes = {
  runtime: PropTypes.number,
  revenue: PropTypes.number,
  budget: PropTypes.number,
  language: PropTypes.string,
  productionCompanies: PropTypes.arrayOf(PropTypes.string),
  movieStatus: PropTypes.string,
  releaseDate: PropTypes.string,
};
function RecommendedCarousel({ movieId }) {
  const [recommendations, setRecommendations] = useState([]);
  const movieChunks = chunk(recommendations, 5);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const data = await getRecommendations(movieId);
      setRecommendations(data);
    };
    fetchRecommendations();
  }, [movieId]);

  return (
    <section>
      <Carousel className="carousel-movie" indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div
                className={MovieCardStyle["card-container"]}
                key={`${i}-${j}`}
              >
                <Link to={`/api/movies/movie/${movie.id}`}>
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
RecommendedCarousel.propTypes = {
  movieId: PropTypes.number,
};
export {
  TruncateDescription,
  getYearFromDate,
  MovieRuntime,
  MovieTrailer,
  MovieAverage,
  MovieGenres,
  MovieCardGenres,
  MovieActors,
  MovieCardActors,
  MovieReviews,
  MovieDetails,
  RecommendedCarousel,
};
