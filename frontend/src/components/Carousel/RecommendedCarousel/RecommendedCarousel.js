import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { chunk } from "lodash";
import RecommendedStyle from "./RecommendedCarousel.module.css";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";

import MovieCard from "../../MovieCard/MovieCard.js";
import getDetailedMovie from "../../../axios/GetDetailedMovie.js";
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";
export default function RecommendedCarousel({ movieId, onRecommendedMoviesLoad }) {
  const [recommendations, setRecommendations] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoints = [979, 1471, 1971, 2463];

  useWindowResizeEffect(setWindowWidth);

  useEffect(() => {
    async function fetchRecommendations() {
      const data = await getDetailedMovie("recommendations", { page: 1 }, movieId);
      if (data) {
        setRecommendations(data.detailedMovies);
        onRecommendedMoviesLoad();
      }
    }
    fetchRecommendations();
  }, [movieId])

  if (recommendations.length === 0) {
    return null;
  }

  const movieChunks = chunk(recommendations, getChunkSize(windowWidth, breakpoints));

  return (
    <div className={MovieCardStyle["carousel-wrapper"]}>
      <Carousel className={RecommendedStyle["carousel-recommended"]} indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div
                className={RecommendedStyle["recommended-card-container"]}
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
        ))}
      </Carousel>
      <style>{CarouselArrowStyles}</style>
    </div>
  );
}
RecommendedCarousel.propTypes = {
  movieId: PropTypes.number,
  onRecommendedMoviesLoad: PropTypes.func,
};