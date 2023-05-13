import { React, useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import isExpired from "../../Other/IsTokenExpired.js";
import PropTypes from "prop-types";
import "./MovieCarousel.css";
import { chunk } from "lodash";
import "../title.scss";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import Cookies from "js-cookie";
import MovieCard from "../../MovieCard/MovieCard.js";

export default function MovieCarousel({ title, endpoint }) {
  const [movies, setMovies] = useState([]);
  const movieChunks = chunk(movies, 5);
  MovieCarousel.propTypes = {
    title: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };
  useEffect(() => {
    async function fetchData(endpoint) {
      try {
        let token = Cookies.get("accessToken");

        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(await response.data);
      } catch (error) {
        // Token expired, get a new token and retry the request
        await isExpired();
        console.log(Cookies.get("accessToken"), Cookies.get("refreshToken"));
        try {
          let newAccessToken = Cookies.get("accessToken");
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          setMovies(await response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData(endpoint);
  }, [endpoint]);
  return (
    <section>
      <h3-title>{title}</h3-title>
      <Carousel className="carousel-movie" indicators={false} interval={null}>
        {movieChunks.map((chunk, i) => (
          <Carousel.Item key={i}>
            {chunk.map((movie, j) => (
              <div
                className={MovieCardStyle["main-card-container"]}
                key={`${i}-${j}`}
              >
                <Link to={`${endpoint}/${movie.id}`}>
                  <MovieCard
                    poster={movie.posterPath}
                    rating={movie.voteAverage}
                    runtime={movie.runtime}
                    genres={movie.genres}
                    overview={movie.overview}
                    actors={movie.actors}
                    video={movie.video}
                  />
                </Link>
              </div>
            ))}
          </Carousel.Item>
        ))}
      </Carousel>
    </section>
  );
}
