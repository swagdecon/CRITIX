import { React, useState } from "react";
import "./Search.css";
import axios from "axios";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { GetYearFromDate } from "../Other/movieComponents";
const Search = (props) => {
  const [query, setQuery] = useState("");
  const [detailedMovies, setDetailedMovies] = useState([]);

  const api_key = "d84f9365179dc98dc69ab22833381835";
  const language = "en-US";
  const page = 1;

  const handleChange = async (event) => {
    const value = event.target.value;
    setQuery(value);

    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${value}&language=${language}&page=${page}&include_adult=${false}`
    );

    const detailedMoviesArray = await Promise.all(
      response.data.results.map(async (movie) => {
        const detailedResponse = await axios.get(
          ` https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}&language=en-US`
        );
        const getTopActors = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${api_key}`
        );
        const actors = getTopActors.data.cast
          .slice(0, 5)
          .map((actor) => actor.name);

        return {
          ...detailedResponse.data,
          actors: actors,
        };
      })
    );

    setDetailedMovies(detailedMoviesArray);
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
        {detailedMovies.slice(0, 5).map((movie) => {
          if (movie.poster_path && movie.vote_average) {
            return (
              <Link to={`/movies/movie/${movie.id}`} key={movie.id}>
                <li className="ind-search-result">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  />
                  <div className="result-title-data">
                    <div className="result-title">
                      {movie.title} ({GetYearFromDate(movie.release_date)})
                    </div>

                    <div className="result-actors">
                      {movie.actors.slice(0, 3).map((actor, index) => (
                        <span key={index}>
                          {index === 0 ? actor : ` | ${actor}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="result-rating">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </li>
              </Link>
            );
          } else {
            return null;
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
