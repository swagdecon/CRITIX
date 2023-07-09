import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import Title from "../title.module.scss";
import { chunk } from "lodash";
import PropTypes from "prop-types";
import MovieCardStyle from "../../MovieCard/moviecard.module.scss";
import MovieCard from "../../MovieCard/MovieCard.js";
import useFetchData from "../../../security/FetchApiData.js";

function MovieCarousel({ title, endpoint }) {
  const { data: movies } = useFetchData(endpoint);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getChunkSize = () => {
    if (windowWidth <= 979) {
      return 1
    }
    else if (windowWidth <= 1471) {
      return 2
    }
    else if (windowWidth <= 1971) {
      return 3;
    } else if (windowWidth <= 2463) {
      return 4;
    } else {
      return 5;

    }

  };

  const movieChunks = chunk(movies, getChunkSize());

  return (
    <section>
      <div className={MovieCardStyle.wrapper}>
        <div className={MovieCardStyle.titleWrapper}>
          <h3 className={Title.carouselTitle}>{title}</h3>
        </div>
        {movies.length > 0 && (
          <Carousel className="carousel-movie" indicators={false} interval={null}>
            {movieChunks.map((chunk, i) => (
              <Carousel.Item key={i}>
                <div className={MovieCardStyle.carouselHeader} />
                {chunk.map((movie) => (
                  <div className={MovieCardStyle["main-card-container"]} key={movie.id}>
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
        )}
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
