import React from "react";
import { Link } from "react-router-dom";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";
import MovieCard from "../../MovieCard/MovieCard.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from "styled-components";
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT

const RecommendedCardSlider = styled(Slider)`
.slick-prev {
  left: .25vw;
  z-index:1;
}
.slick-next {
  right: .25vw;
    z-index:1;
}
`
const settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 6,
  slidesToScroll: 5,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 3140,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 2570,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 5,
        initialSlide: 2
      }
    },
    {
      breakpoint: 2040,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1560,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 1030,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};
export default function RecommendedCarousel({ recommendedMovies }) {

  return (
    <div className={MovieCardStyle["carousel-wrapper"]}>
      <RecommendedCardSlider {...settings} className={MovieCardStyle.Slider}>
        {recommendedMovies.map((movie, i) => (
          <div key={i}>
            <Link to={`${indMovieEndpoint}${movie.movieId}`}>
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
                shareUrl={`${indMovieEndpoint}${movie.movieId}`}
              />
            </Link>
          </div>
        ))}
      </RecommendedCardSlider>
    </div >
  );
}

RecommendedCarousel.propTypes = {
  recommendedMovies: PropTypes.array.isRequired
};