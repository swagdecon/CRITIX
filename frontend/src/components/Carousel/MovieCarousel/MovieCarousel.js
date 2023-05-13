import { React } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../title.scss";
import { chunk } from "lodash";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import fetchData from "../../../axios/FetchMovieData.js";
export default function MovieCarousel({ title, endpoint }) {
  MovieCarousel.propTypes = {
    title: PropTypes.string.isRequired,
    endpoint: PropTypes.string.isRequired,
  };
  const movies = fetchData(endpoint);
  const movieChunks = chunk(movies, 5);

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
