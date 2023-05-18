import React from "react";
import MovieList from "../components/MovieList/MovieList";
import NavBar from "../components/NavBar/NavBar";
import PropTypes from "prop-types";

export default function MovieListPage({ title, caption, endpoint }) {
  MovieListPage.propTypes = {
    title: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };

  return (
    <div>
      <NavBar />
      <MovieList title={title} caption={caption} endpoint={endpoint} />
    </div>
  );
}
