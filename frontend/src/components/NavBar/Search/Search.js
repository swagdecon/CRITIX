import React, { useState, useEffect, useRef } from "react";
import SearchStyle from "./Search.module.css";
import PropTypes from "prop-types";
import { ParseYear } from "../../IndMovie/MovieComponents";
import ReactPlaceholderTyping from 'react-placeholder-typing'
import isTokenExpired from "../../../security/IsTokenExpired";
import { fetchData } from "../../../security/FetchApiData";
const searchEndpoint = process.env.REACT_APP_SEARCH_ENDPOINT;
const miniPosterUrl = process.env.REACT_APP_MINI_POSTER_URL;

export default function Search(props) {
  const [query, setQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const searchRef = useRef();

  const placeholders = [
    'Discover cinematic brilliance',
    'Unearth hidden gems',
    'Share your filmic insights',
    'Find your next favorite movie',
    'Explore cinematic wonders',
    'Express your movie passion',
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setMovieResults([]);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchMovies(query);
    }, 500);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);

  const searchMovies = async (searchQuery) => {
    if (!searchQuery) {
      setMovieResults([]);
      return;
    }

    try {
      await isTokenExpired();
      const formattedQuery = searchQuery.includes(' ') ? searchQuery.trim().split(' ').join('+') : searchQuery.trim();
      const endpoint = `${searchEndpoint}/${formattedQuery}`;

      const search = await fetchData(endpoint);
      setMovieResults(search);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <form onSubmit={props.onSubmit} id="search" className={SearchStyle.Search} ref={searchRef}>
      <ReactPlaceholderTyping
        placeholders={placeholders}
        value={query}
        onChange={(value) => {
          setQuery(value)
        }}
        containerStyle={{ borderWidth: "0px" }}
      />
      <ul className={SearchStyle["search-results-list"]}>
        {movieResults.map((movie) => {
          if (movie.poster_path && movie.vote_average) {
            return (
              <a
                href={`/movies/movie/${movie.id}`}
                key={movie.id}
                onClick={() => setMovieResults([])}
              >
                <li className={SearchStyle["ind-search-result"]}>
                  <img
                    src={`${miniPosterUrl}${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className={SearchStyle["result-title-data"]}>
                    <div className={SearchStyle["result-title"]}>
                      {movie.title}
                      <div className={SearchStyle["result-release-date"]}>
                        <span>({<ParseYear date={movie.release_date} />})</span>
                      </div>
                    </div>
                    {/* <div className={SearchStyle["result-actors"]}>
                      {movie.actors.slice(0, 3).map((actor, index) => (
                        <span key={index}>
                          {index === 0 ? actor : ` | ${actor}`}
                        </span>
                      ))}
                    </div> */}
                  </div>
                  <div className={SearchStyle["result-rating"]}>
                    {movie.vote_average}
                  </div>
                </li>
              </a>
            );
          }
        })}
      </ul>
    </form>
  );
}

Search.propTypes = {
  onSubmit: PropTypes.func,
};
