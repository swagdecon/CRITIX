import { React, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./ind_movie/ind_movie.css";
import ReactTextCollapse from "../../node_modules/react-text-collapse/dist/ReactTextCollapse";

function truncateDescription(description) {
  const words = description.split(" ");

  if (words.length > 30) {
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
function MovieAverage(vote_average) {
  if (!vote_average) {
    return "No Rating";
  }
  return vote_average;
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
  if (!reviews) {
    return <div>N/A</div>;
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
          <div className="scroll scroll4">
            {/* <div className="review__score">{review.rating}%</div> */}
            <p className="review__description">{review}</p>
            <br />
          </div>
        </ReactTextCollapse>
      ))}
    </div>
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
};
