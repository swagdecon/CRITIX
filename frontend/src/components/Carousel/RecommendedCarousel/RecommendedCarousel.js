import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { chunk } from "lodash";
import { Link } from "react-router-dom";
import axios from "axios";
import RecommendedStyle from "./RecommendedCarousel.module.css";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";
import CookieManager from "../../../security/CookieManager";
import MovieCard from "../../MovieCard/MovieCard.js";
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";
const recommendedEndpoint = process.env.REACT_APP_RECOMMENDED_ENDPOINT;
const recommendedEndpointOptions = process.env.REACT_APP_RECOMMENDED_ENDPOINT_OPTIONS;

export default function RecommendedCarousel({ movieId, onRecommendedMoviesLoad }) {
  const [recommendations, setRecommendations] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoints = [979, 1471, 1971, 2463];
  useWindowResizeEffect(setWindowWidth);

  useEffect(() => {
    const fetchData = async (endpoint) => {
      let token = CookieManager.decryptCookie("accessToken");
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecommendations(response.data);
        onRecommendedMoviesLoad();
      } catch (error) {
        console.log(error);
      }
    };
    const endpoint = `${recommendedEndpoint}${movieId}/${recommendedEndpointOptions}`

    fetchData(endpoint)
  }, []);
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
                <Link to={`/movies/movie/${movie.id}`}>
                  <MovieCard
                    movieId={movie.id}
                    poster={`https://image.tmdb.org/t/p/original${movie.posterUrl}`}
                    rating={movie.voteAverage}
                    runtime={movie.runtime}
                    genres={movie.genres}
                    overview={movie.overview}
                  />
                </Link>
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