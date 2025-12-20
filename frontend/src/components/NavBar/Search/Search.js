import React, { useState, useEffect, useRef } from "react";
import SearchStyle from "./Search.module.css";
import { ParseYear } from "../../IndFilm/MovieComponents";
import { TypeAnimation } from 'react-type-animation';
import isTokenExpired from "../../../security/IsTokenExpired";
import { fetchData } from "../../../security/Data";
const searchEndpoint = process.env.REACT_APP_SEARCH_ENDPOINT;
const miniPosterUrl = process.env.REACT_APP_MINI_POSTER_URL;
const API_URL = process.env.REACT_APP_BACKEND_API_URL
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT

export default function Search() {
  const [query, setQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef();
  const inputRef = useRef();

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
        setIsFocused(false);
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
      const endpoint = `${API_URL}${searchEndpoint}${formattedQuery}`;

      const search = await fetchData(endpoint);
      setMovieResults(search || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prevent form submission
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Prevent Enter key action
    }
  }

  const handleClose = () => {
    setMovieResults([]);
    setQuery("");
    setIsFocused(false);
  }

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleBlur = (e) => {
    // Only blur if clicking outside the search component
    if (!searchRef.current?.contains(e.relatedTarget)) {
      setIsFocused(false);
    }
  }

  return (
    <>
      {/* Backdrop overlay */}
      {movieResults.length > 0 && (
        <div className={SearchStyle.searchBackdrop} onClick={handleClose} />
      )}

      <form onSubmit={handleSubmit} className={SearchStyle.Search} ref={searchRef}>
        <div style={{ position: "relative", display: "inline-block" }}>
          {query === "" && !isFocused && (
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder=""
            className={isFocused ? SearchStyle.focused : ""}
          />
        </div>
        <div className={SearchStyle["search-results-list"]}>
          {movieResults.map((movie) => {
            if (movie.poster_path && movie.vote_average) {
              return (
                <a
                  href={`${indMovieEndpoint}${movie.id}`}
                  key={movie.id}
                  onClick={handleClose}
                  className={SearchStyle["result-link"]}
                >
                  <div className={SearchStyle["ind-search-result"]}>
                    <img
                      src={`${miniPosterUrl}${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <div className={SearchStyle["result-title-data"]}>
                      <div className={SearchStyle["result-title"]}>
                        {movie.title}
                      </div>
                      <div className={SearchStyle["result-release-date"]}>
                        <ParseYear date={movie.release_date} />
                      </div>
                    </div>
                    <div className={SearchStyle["result-rating"]}>
                      {movie.vote_average}
                    </div>
                  </div>
                </a>
              );
            }
            return null;
          })}
        </div>
      </form>
    </>
  );
}