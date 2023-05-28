import { React, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { chunk } from "lodash";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import PropTypes from "prop-types";

import MovieCard from "../../MovieCard/MovieCard.js";
import getDetailedMovie from "../../../axios/GetDetailedMovie.js";

export default function RecommendedCarousel({ movieId, onRecommendedMoviesLoad }) {
  RecommendedCarousel.propTypes = {
    movieId: PropTypes.number,
    onRecommendedMoviesLoad: PropTypes.func,

  };
  const [recommendations, setRecommendations] = useState([]);

  const movieChunks = chunk(recommendations, 5);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const data = await getDetailedMovie("recommendations", { page: 1 }, movieId);
      data ?
        setRecommendations(data.detailedMovies) &&
        onRecommendedMoviesLoad()
        : null
    }
    fetchRecommendations();
  }, [movieId]);
  if (!recommendations) {
    return;
  }

  return (
    <Carousel className="carousel-movie" indicators={false} interval={null}>
      {movieChunks.map((chunk, i) => (
        <Carousel.Item key={i}>
          {chunk.map((movie, j) => (
            <div
              className={MovieCardStyle["recommended-card-container"]}
              key={`${i}-${j}`}
            >
              <a href={`/movies/movie/${movie.id}`}>
                <MovieCard
                  poster={movie.poster_path}
                  rating={movie.vote_average}
                  runtime={movie.runtime}
                  genres={movie.genres}
                  overview={movie.overview}
                  actors={movie.actors}
                  video={movie.trailer}
                />
              </a>
            </div>
          ))}
        </Carousel.Item>
      ))
      }
    </Carousel >
  );
}
