import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { chunk } from "lodash";
import isExpired from "../../../security/IsTokenExpired";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RecommendedStyle from "./RecommendedCarousel.module.css";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss"
import PropTypes from "prop-types";
import CookieManager from "../../../security/CookieManager";
import MovieCard from "../../MovieCard/MovieCard.js";
import { getChunkSize, useWindowResizeEffect, CarouselArrowStyles } from "../CarouselHelpers.js";
export default function RecommendedCarousel({ movieId, onRecommendedMoviesLoad }) {
  const [recommendations, setRecommendations] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const breakpoints = [979, 1471, 1971, 2463];
  const navigate = useNavigate();

  useWindowResizeEffect(setWindowWidth);

  useEffect(() => {
    const fetchData = async (endpoint) => {
      await isExpired(navigate);
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
    const url = "/movies/recommended/"
    const options = "language=en-US&page=1"
    const endpoint = `${url}${movieId}/${options}`
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
                <a href={`/movies/movie/${movie.id}`}>
                  <MovieCard
                    poster={`https://image.tmdb.org/t/p/original${movie.posterUrl}`}
                    rating={movie.voteAverage}
                    runtime={movie.runtime}
                    genres={movie.genres}
                    overview={movie.overview}
                  // Cannot get this information without a ridiculous number of extra api requests
                  // actors={movie.actors}
                  // video={movie.trailer}
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