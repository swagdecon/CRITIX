import React from "react";
import PropTypes from "prop-types";

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

export { truncateDescription, getYearFromDate, MovieTrailer, MovieGenres };
