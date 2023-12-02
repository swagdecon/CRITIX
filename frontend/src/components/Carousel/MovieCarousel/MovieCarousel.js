import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import Title from "../title.module.scss";
import { chunk } from "lodash";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import useFetchData from "../../../security/FetchApiData.js";
import MovieCarouselStyle from "./MovieCarousel.module.css"
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";

function MovieCarousel({ title, endpoint }) {
  const { data: movies } = useFetchData(endpoint);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoints = [979, 1471, 1971, 2463];
  useWindowResizeEffect(setWindowWidth);
  const movieChunks = chunk(movies, getChunkSize(windowWidth, breakpoints));
  return (
    <div className={MovieCarouselStyle["carousel-wrapper"]}>
      <div className={MovieCardStyle.titleWrapper}>
        <h3 className={`${Title["homepage-carousel"]} ${Title["movie-title"]}`}>{title}</h3>
      </div>
      <Carousel className={MovieCarouselStyle["carousel-movie"]} indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            <div className={MovieCardStyle.carouselHeader} />
            {chunk.map((movie) => (
              <div className={MovieCardStyle["main-card-container"]} key={movie.id}>
                <Link to={`${endpoint}/${movie.id}`}>
                  <MovieCard
                    poster={movie.posterUrl}
                    rating={movie.voteAverage}
                    genres={movie.genres}
                    overview={movie.overview}
                    actors={movie.actors}
                    trailer={movie.trailer}
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

export default React.memo(MovieCarousel);
