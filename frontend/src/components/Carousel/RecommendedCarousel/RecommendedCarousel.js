import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { chunk } from "lodash";
import RecommendedStyle from "./RecommendedCarousel.module.css";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";
import MovieCard from "../../MovieCard/MovieCard.js";
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";
const TMDB_IMAGE_PREFIX = process.env.REACT_APP_DEFAULT_TMDB_IMAGE_PREFIX;
export default function RecommendedCarousel({ recommendedMovies }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoints = [979, 1471, 1971, 2463];
  useWindowResizeEffect(setWindowWidth);
  const movieChunks = chunk(recommendedMovies, getChunkSize(windowWidth, breakpoints));
  const handleRedirect = (movieId) => {
    window.location.href = `/movies/movie/${movieId}`;
  };

  return (
    <div className={MovieCardStyle["carousel-wrapper"]}>
      <Carousel className={RecommendedStyle["carousel-recommended"]} indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div
                className={RecommendedStyle["recommended-card-container"]}
                key={`${i}-${j}`}>
                <div onClick={() => handleRedirect(movie.id)} className={MovieCardStyle.cardWrapper}>
                  <MovieCard
                    movieId={movie.id}
                    poster={`${TMDB_IMAGE_PREFIX}${movie.posterUrl}`}
                    rating={movie.voteAverage}
                    runtime={movie.runtime}
                    genres={movie.genres}
                    overview={movie.overview}
                  />
                </div>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
      <style>{CarouselArrowStyles}</style>
    </div>
  );
}
RecommendedCarousel.propTypes = {
  recommendedMovies: PropTypes.array.isRequired
};