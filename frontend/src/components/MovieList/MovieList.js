import { React, useState, useEffect } from "react";
import MovieListStyle from "./MovieList.module.css";
import MovieCard from "../../components/MovieCard/MovieCard";
import { Link } from "react-router-dom";
import "../Carousel/title.scss";
import PropTypes from "prop-types";
import getDetailedMovie from "../../axios/GetDetailedMovie";
import LoadingPage from "../../views/LoadingPage";
export default function MovieList({ endpoint }) {
  MovieList.propTypes = {
    endpoint: PropTypes.string.isRequired,
  };
  const [movies, setMovies] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(true);

  useEffect(() => {
    async function getDetailedMovieData() {
      const data = await getDetailedMovie(endpoint.endpointName);
      setMovies(data);
      setDataLoaded(true);
    }

    getDetailedMovieData();
  }, [endpoint.endpointName]);
  if (!dataLoaded) {
    return <LoadingPage />;
  }
  let title;
  let caption;
  if (endpoint.endpointName === "now_playing") {
    title = "In Theatres:";
    caption = "The Latest Movies on the Big Screen";
  } else if (endpoint.endpointName === "upcoming") {
    title = "Upcoming Movies:";
    caption = "Get a Sneak Peek of What's Coming Soon";
  } else if (endpoint.endpointName === "popular") {
    title = "Discover What Everyone Is Watching Right Now";
    caption = "Popular Movies:";
  }

  return (
    <div>
      <div className={MovieListStyle["title-container"]}>
        <h3-title>{title}</h3-title>
        <div className={MovieListStyle["title-caption"]}>{caption}</div>
      </div>
      <div className={MovieListStyle["container"]}>
        {movies.map((movie, i) => (
          <div key={i}>
            <Link to={`/movies/${endpoint.endpointName}/${movie.id}`}>
              <MovieCard
                poster={movie.poster_path}
                rating={movie.vote_average}
                runtime={movie.runtime}
                genres={movie.genres}
                overview={movie.overview}
                actors={movie.actors}
                video={movie.video}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
