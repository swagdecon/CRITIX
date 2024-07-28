import React from "react";
import { Link } from "react-router-dom";
import Title from "../title.module.scss";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import MovieCarouselStyle from "./MovieCarousel.module.css"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function MovieCarousel({ title, movies, endpoint }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 7,
    slidesToScroll: 5,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 3350,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 5,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 2850,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 2450,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 5,
          initialSlide: 2
        }
      },
      {
        breakpoint: 1950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 1420,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div className={MovieCarouselStyle["carousel-wrapper"]}>
      <div className={MovieCardStyle.titleWrapper}>
        <h3 className={`${Title["homepage-carousel"]} ${Title["movie-title"]}`}>{title}</h3>
      </div>
      <Slider {...settings} className={MovieCardStyle.Slider}>
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
      </Slider>
    </div >
  );
}

MovieCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  movies: PropTypes.array,
};

export default MovieCarousel;
