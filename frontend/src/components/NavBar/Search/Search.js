import { React, useState } from "react";
import "./Search.css";
import axios from "axios";
import PropTypes from "prop-types";
import { GetYearFromDate } from "../../IndMovie/MovieComponents";
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;



export default function Search(props) {
  const [query, setQuery] = useState("");
  const [detailedMovies, setDetailedMovies] = useState([]);
  const searchMovies = async (searchQuery) => {
    if (!searchQuery) {
      setDetailedMovies([]);
      return;
    }
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&language=en-US&page=1&include_adult=false`
    );
    const detailedMoviesArray = await Promise.all(
      response.data.results.slice(0, 5).map(async (movie) => {
        const detailedResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=en-US`
        );
        const getTopActors = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`
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
  const handleChange = async (event) => {
    const value = event.target.value;
    setQuery(value);
    searchMovies(value);
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
        {detailedMovies.map((movie) => {
          if (movie.poster_path && movie.vote_average) {
            return (
              <a href={`/movies/movie/${movie.id}`} key={movie.id} onClick={() => setDetailedMovies([])}>
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
              </a>
            );
          } else {
            return null;
          }
        })}
      </ul>
    </form>
  );
}
Search.propTypes = {
  onSubmit: PropTypes.func,
};
