import React, { useState, useEffect, useRef } from "react";
import SearchStyle from "./Search.module.css";
import axios from "axios";
import PropTypes from "prop-types";
import { ParseYear } from "../../IndMovie/MovieComponents";
import useFetchData from "../../../security/FetchApiData";
import ReactPlaceholderTyping from 'react-placeholder-typing'
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;


export default function Search(props) {
  const [query, setQuery] = useState("");
  const [detailedMovies, setDetailedMovies] = useState([]);
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
        setDetailedMovies([]);
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
    },);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);


  const searchMovies = async (searchQuery) => {
    if (!searchQuery) {
      setDetailedMovies([]);
      return;
    }
    const queryAndOptions = `&query=${query}&language=en-US&page=1&include_adult=false`
    const { data: movies } = useFetchData("/movies/search", queryAndOptions);
    console.log(movies)

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
        {detailedMovies.map((movie) => {
          if (movie.poster_path && movie.vote_average) {
            return (
              <a
                href={`/movies/movie/${movie.id}`}
                key={movie.id}
                onClick={() => setDetailedMovies([])}
              >
                <li className={SearchStyle["ind-search-result"]}>
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt={movie.title}
                  />
                  <div className={SearchStyle["result-title-data"]}>
                    <div className={SearchStyle["result-title"]}>
                      {movie.title} <ParseYear date={movie.release_date} />
                    </div>
                    <div className={SearchStyle["result-actors"]}>
                      {movie.actors.slice(0, 3).map((actor, index) => (
                        <span key={index}>
                          {index === 0 ? actor : ` | ${actor}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={SearchStyle["result-rating"]}>
                    {movie.vote_average.toFixed(1) * 10}
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
