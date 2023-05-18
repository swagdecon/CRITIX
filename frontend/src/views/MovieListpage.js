import React from "react";
import MovieList from "../components/MovieList/MovieList";
import NavBar from "../components/NavBar/NavBar";
import PropTypes from "prop-types";

export default function MovieListPage({ title, endpoint }) {
  MovieListPage.propTypes = {
    title: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };
  return (
    <div>
      <NavBar />
      <MovieList title={title} endpoint={endpoint} />
    </div>
  );
}
