import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { chunk } from "lodash";
import RecommendedStyle from "./RecommendedCarousel.module.css";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";
import MovieCard from "../../MovieCard/MovieCard.js";
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";

const carouselBreakpoints = process.env.REACT_APP_CAROUSEL_BREAKPOINTS;
const recommendedCarouselBreakpoints = JSON.parse(carouselBreakpoints);

export default function RecommendedCarousel({ recommendedMovies }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useWindowResizeEffect(setWindowWidth);
  const movieChunks = chunk(recommendedMovies, getChunkSize(windowWidth, recommendedCarouselBreakpoints));

  return (
    <div className={MovieCardStyle["carousel-wrapper"]}>
      <Carousel className={RecommendedStyle["carousel-recommended"]} indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div
                className={RecommendedStyle["recommended-card-container"]}
                key={`${i}-${j}`}>
                <div className={MovieCardStyle.cardWrapper}>
                  <Link to={`/movies/movie/${movie.id}`}>
                    <MovieCard
                      movieId={movie.id}
                      poster={movie.posterUrl}
                      rating={movie.voteAverage}
                      runtime={movie.runtime}
                      genres={movie.genres}
                      overview={movie.overview}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
      <style>{CarouselArrowStyles}</style>
    </div >
  );
}

RecommendedCarousel.propTypes = {
  recommendedMovies: PropTypes.array.isRequired
};