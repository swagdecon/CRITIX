import React from "react";
import MovieList from "../components/MovieList/MovieList";
import NavBar from "../components/NavBar/NavBar";

export default function MovieListPage(endpoint) {
  return (
    <div>
      <NavBar />
      <MovieList endpoint={endpoint} />
    </div>
  );
}
