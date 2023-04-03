import { React, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ind_movie/ind_movie.css";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import { RiMoneyDollarBoxFill } from "react-icons/ri";
import { BsWallet2 } from "react-icons/bs";
import { FaLanguage } from "react-icons/fa";
import { AiOutlineClockCircle } from "react-icons/ai";
import { MdOutlineMovie, MdDateRange } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";
function truncateDescription(description) {
  const words = description.split(" ");

  if (words.length > 30) {
    if (!words) {
      return "No Description Available";
    }
    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
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
function MovieAverage(voteAverage) {
  if (!voteAverage) {
    return "No Rating";
  }
  return voteAverage;
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

const MovieActors = ({ actors, images }) => {
  MovieActors.propTypes = {
    actors: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
  };

  if (!images || !actors) {
    return (
      <div className="profile-container">
        {actors.slice(0, 4).map((actor, index) => (
          <div
            key={index}
            className="card card1"
            style={{
              background: `url(https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg)  center no-repeat`,
              backgroundSize: "fill",
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
        ))}
      </div>
    );
  }

  return (
    <div className="profile-container">
      {actors.slice(0, 4).map((actor, index) => (
        <div
          key={index}
          className="card card1"
          style={{
            background: `url(https://image.tmdb.org/t/p/w500${images[index]}) center center no-repeat`,
            backgroundSize: "350px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `url(https://image.tmdb.org/t/p/w500${images[index]}) left center no-repeat `;
            e.currentTarget.style.backgroundSize = "600px";
            e.currentTarget.querySelector("h3").style.opacity = 1;
            Array.from(e.currentTarget.querySelectorAll(".fa")).forEach(
              (icon) => {
                icon.style.opacity = 1;
              }
            );
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `url(https://image.tmdb.org/t/p/w500${images[index]}) center center no-repeat `;
            e.currentTarget.style.backgroundSize = "300px";
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
      ))}
    </div>
  );
};

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
  MovieDetails.propTypes = {
    runtime: PropTypes.arrayOf(PropTypes.string),
  };
  MovieDetails.propTypes = {
    revenue: PropTypes.arrayOf(PropTypes.integer),
  };
  MovieDetails.propTypes = {
    budget: PropTypes.arrayOf(PropTypes.integer),
  };
  MovieDetails.propTypes = {
    language: PropTypes.arrayOf(PropTypes.string),
  };
  MovieDetails.propTypes = {
    productionCompanies: PropTypes.arrayOf(PropTypes.string),
  };
  MovieDetails.propTypes = {
    movieStatus: PropTypes.arrayOf(PropTypes.string),
  };
  MovieDetails.propTypes = {
    releaseDate: PropTypes.arrayOf(PropTypes.string),
  };

  return (
    <section className="movieDetailsContainer">
      <div className="ind-movie-details-card">
        <div className="card-overlay">
          <div className="movie-Details-Title">Movie Details</div>
          <div className="movie-info-row">
            <ul className="movie-column">
              <ul className="ind_movie_runtime">
                <AiOutlineClockCircle className="movie_info_logo" size={50} />

                <div className="movie_info_text">
                  {runtime ? `${runtime} minutes` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className="ind_movie_revenue">
                <RiMoneyDollarBoxFill className="movie_info_logo" size={50} />
                <div className="movie_info_text">
                  {revenue ? `$${revenue}` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className="ind_movie_budget">
                <BsWallet2 className="movie_info_logo" size={50} />
                <div className="movie_info_text">
                  {budget ? `$${budget}` : "N/A"}
                </div>
              </ul>
              <br />
              <ul className="ind_movie_language">
                <FaLanguage className="movie_info_logo" size={50} />
                <div className="movie_info_text">
                  {language ? language : "N/A"}
                </div>
              </ul>
            </ul>
            <ul className="movie-column">
              <ul className="ind_movie_production_company">
                <div className="ind_movie_details_title"></div>
                <MdOutlineMovie className="movie_info_logo" size={50} />
                <div className="movie_info_text">
                  {productionCompanies ? productionCompanies[0] : "N/A"}
                </div>
              </ul>
              <br />
              <div className="ind_movie_status">
                <RiMovie2Line size={50} className="movie_info_logo" />
                <div className="movie_info_text">
                  {movieStatus ? movieStatus : "N/A"}
                </div>
              </div>
              <br />
              <div className="ind_movie_date">
                <MdDateRange size={50} className="movie_info_logo" />
                <div className="movie_info_text">
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
export {
  truncateDescription,
  getYearFromDate,
  MovieTrailer,
  MovieAverage,
  MovieGenres,
  MovieActors,
  MovieReviews,
  MovieDetails,
};
