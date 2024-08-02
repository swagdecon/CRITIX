import React from "react";
import { Link } from "react-router-dom";
import Title from "../title.module.scss";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import MovieCarouselStyle from "./MovieCarousel.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import styled from "styled-components";
import "slick-carousel/slick/slick-theme.css";

const MovieCardSlider = styled(Slider)`
.slick-prev {
  left: .25vw;
  z-index:1;
}
.slick-next {
  right: .25vw;
    z-index:1;
}
`
function MovieCarousel({ title, movies, endpoint, breakpoints }) {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: breakpoints
  };
  console.log(movies)
  return (
    <div className={MovieCarouselStyle["carousel-parent"]}>
      <div className={MovieCarouselStyle["carousel-wrapper"]}>
        <div className={MovieCardStyle.titleWrapper}>
          <h3 className={`${Title["homepage-carousel"]} ${Title["movie-title"]}`}>{title}</h3>
        </div>
        <MovieCardSlider {...settings}>
          {movies.map((movie, i) => (
            <div key={i}>
              <Link to={`${endpoint}/${movie.id || movie.movieId}`}>
                <MovieCard
                  movieId={movie.id || movie.movieId}
                  title={movie.title}
                  posterUrl={movie.posterUrl}
                  voteAverage={movie.voteAverage}
                  genres={movie.genres}
                  overview={movie.overview}
                  actors={movie.actors}
                  isSavedToWatchlist={movie.isSavedToWatchlist}
                  isSavedToFavouriteMoviesList={movie.isSavedToFavouriteMoviesList}
                  shareUrl={`${endpoint}movie/${movie.id}`}
                />
              </Link>
            </div>
          ))}
        </MovieCardSlider>
      </div >
    </div>
  );
}

MovieCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  movies: PropTypes.array,
  breakpoints: PropTypes.array
};

export default MovieCarousel;
