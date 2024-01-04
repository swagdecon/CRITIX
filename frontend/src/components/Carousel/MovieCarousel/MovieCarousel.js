import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import Title from "../title.module.scss";
import { chunk } from "lodash";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import MovieCarouselStyle from "./MovieCarousel.module.css"
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";

const carouselBreakpoints = process.env.REACT_APP_CAROUSEL_BREAKPOINTS;
const movieCarouselBreakpoints = JSON.parse(carouselBreakpoints);

function MovieCarousel({ title, movies, endpoint }) {

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useWindowResizeEffect(setWindowWidth);
  const movieChunks = chunk(movies, getChunkSize(windowWidth, movieCarouselBreakpoints));

  return (
    <div className={MovieCarouselStyle["carousel-wrapper"]}>
      <div className={MovieCardStyle.titleWrapper}>
        <h3 className={`${Title["homepage-carousel"]} ${Title["movie-title"]}`}>{title}</h3>
      </div>
      <Carousel className={MovieCarouselStyle["carousel-movie"]} indicators={false} interval={null}>
        {movieChunks.map((movieChunk, i) => (
          <Carousel.Item key={i}>
            <div className={MovieCardStyle.carouselHeader} />
            {movieChunk.map((movie) => (
              <div className={MovieCardStyle["main-card-container"]} key={movie.id}>
                <Link to={`${endpoint}movie/${movie.id}`}>
                  <MovieCard
                    movieId={movie.id}
                    title={movie.title}
                    posterUrl={movie.posterUrl}
                    voteAverage={movie.voteAverage}
                    genres={movie.genres}
                    overview={movie.overview}
                    actors={movie.actors}
                    isSavedToWatchlist={movie.isSavedToWatchlist}
                    shareUrl={`${endpoint}movie/${movie.id}`}
                  />
                </Link>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
      <style>{CarouselArrowStyles}</style>
    </div >
  );
}

MovieCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  movies: PropTypes.array,
};

export default MovieCarousel;
