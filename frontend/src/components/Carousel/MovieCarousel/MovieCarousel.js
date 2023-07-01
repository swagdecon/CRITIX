import React from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../title.scss";
import { chunk } from "lodash";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import useFetchData from "../../../security/FetchApiData.js";

function MovieCarousel({ title, endpoint }) {
  const { data: movies } = useFetchData(endpoint);
  const movieChunks = chunk(movies, 5);

  return (
    <section>
      <h3-title>{title}</h3-title>
      <div className={MovieCardStyle["wrapper"]}>
        <Carousel className="carousel-movie" indicators={false} interval={null}>
          {movieChunks.map((chunk, i) => (
            <Carousel.Item key={i}>
              {chunk.map((movie) => (
                <div
                  className={MovieCardStyle["main-card-container"]}
                  key={movie.id}
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
      </div>
    </section>
  );
}

MovieCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  endpoint: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired,
};

export default React.memo(MovieCarousel);
