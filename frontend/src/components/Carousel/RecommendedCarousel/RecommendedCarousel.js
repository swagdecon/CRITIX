import React from "react";
import { Link } from "react-router-dom";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";
import MovieCard from "../../MovieCard/MovieCard.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
export default function RecommendedCarousel({ recommendedMovies }) {
  console.log(recommendedMovies)

  return (
    <div className={MovieCardStyle["carousel-wrapper"]}>
      <Slider {...settings} className={MovieCardStyle.Slider}>
        {recommendedMovies.map((movie, i) => (
          <div key={i}>
            <Link to={`/movies/movie/${movie.movieId}`}>
              <MovieCard
                title={movie.title}
                movieId={movie.movieId}
                posterUrl={movie.posterUrl}
                voteAverage={movie.voteAverage}
                runtime={movie.runtime}
                genres={movie.genres}
                overview={movie.overview}
                isSavedToFavouriteMovieList={movie.isSavedToFavouriteMovieList}
                isSavedToWatchlist={movie.isSavedToWatchlist}
                shareUrl={`/movies/movie/${movie.movieId}`}
              />
            </Link>
          </div>
        ))}
      </Slider>
    </div >
  );
}

RecommendedCarousel.propTypes = {
  recommendedMovies: PropTypes.array.isRequired
};