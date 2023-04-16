import { React, useState } from "react";
import "./Search.css";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Search = (props) => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const api_key = "d84f9365179dc98dc69ab22833381835";
  const language = "en-US";
  const page = 1;
  const handleChange = async (event) => {
    const value = event.target.value;
    setQuery(value);

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${value}&language=${language}&page=${page}&include_adult=${false}`
    );
    setMovies(response.data.results);
  };
  return (
    <form onSubmit={props.onSubmit} id="search" className="Search">
      <input
        type="search"
        onChange={handleChange}
        value={query}
        placeholder="Search for a title..."
      />
      <ul className="search-results-list">
        {movies.slice(0, 5).map((movie) => {
          if (movie.poster_path && movie.vote_average) {
            return (
              <Link to={`/movies/movie/${movie.id}`} key={movie.id}>
                <li className="ind-search-result">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  />
                  <div className="result-text">{movie.title}</div>
                  <div className="result-rating">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </li>
              </Link>
            );
          } else {
            return null; // Skip over movies without poster or rating
          }
        })}
      </ul>
    </form>
  );
};
Search.propTypes = {
  onSubmit: PropTypes.func,
};
export default Search;
