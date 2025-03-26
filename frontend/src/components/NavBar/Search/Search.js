import React, { useState, useEffect, useRef } from "react";
import SearchStyle from "./Search.module.css";
import PropTypes from "prop-types";
import { ParseYear } from "../../IndMovie/MovieComponents";
import { TypeAnimation } from 'react-type-animation';
import isTokenExpired from "../../../security/IsTokenExpired";
import { fetchData } from "../../../security/Data";
const searchEndpoint = process.env.REACT_APP_SEARCH_ENDPOINT;
const miniPosterUrl = process.env.REACT_APP_MINI_POSTER_URL;

export default function Search(props) {
  const [query, setQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const searchRef = useRef();

  const placeholders = [
    'Discover cinematic brilliance',
    'Unearth hidden gems',
    'Share your film critiques',
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
    <form onSubmit={props.onSubmit} className={SearchStyle.Search} ref={searchRef}>
      <div style={{ position: "relative", display: "inline-block" }}>
        {query === "" && (
          <TypeAnimation
            sequence={placeholders}
            speed={20}
            style={{
              position: "absolute",
              color: "gray",
              pointerEvents: "none",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
            repeat={Infinity}
          />
        )}

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=""
          style={{
            width: "300px",
            padding: "10px",
            fontSize: "1em",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />
      </div>
      <div className={SearchStyle["search-results-list"]}>
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
                  </div>
                  <div className={SearchStyle["result-rating"]}>
                    {movie.vote_average}
                  </div>
                </li>
              </a>
            );
          }
        })}
      </div>
    </form>
  );
}

Search.propTypes = {
  onSubmit: PropTypes.func,
};
