import React from "react";
import PropTypes from "prop-types";
import "./ind_movie/ind_movie.css";

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
  if (!images || !actors) {
    return null;
  }
  MovieActors.propTypes = {
    actors: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
  };

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

export {
  truncateDescription,
  getYearFromDate,
  MovieTrailer,
  MovieAverage,
  MovieGenres,
  MovieActors,
};
