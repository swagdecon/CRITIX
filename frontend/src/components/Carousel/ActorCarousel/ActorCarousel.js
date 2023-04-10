import React from "react";
import { Carousel } from "react-bootstrap";
import { chunk } from "lodash";

import "./ActorCarousel.css";
import PropTypes from "prop-types";
import IndMovieStyle from "../../IndMovie/ind_movie.module.css";

export default function MovieActors({ actors, images }) {
  MovieActors.propTypes = {
    actors: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.string),
  };

  const defaultImage = `url(https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg) center center no-repeat`;
  const actorChunks = chunk(actors, 5);

  return (
    <Carousel className="carousel-actors" interval={null} indicators={false}>
      {actorChunks.map((chunk, chunkIndex) => {
        return (
          <Carousel.Item key={chunkIndex}>
            <div className={IndMovieStyle["profile-container"]}>
              {chunk.map((actor, index) => {
                let image = images ? images[chunkIndex * 5 + index] : null;
                let actorImage = `url(https://image.tmdb.org/t/p/w500${image}) center center no-repeat`;

                if (image === null) {
                  image = defaultImage;
                }

                const style = image
                  ? {
                      background: actorImage,
                      backgroundSize: "300px",
                    }
                  : {
                      background: defaultImage,
                    };

                return (
                  <div
                    key={index}
                    className={`${IndMovieStyle["card"]} ${IndMovieStyle["card1"]}`}
                    style={style}
                    onMouseEnter={(e) => {
                      if (image) {
                        e.currentTarget.style.background = `url(https://image.tmdb.org/t/p/w500${image}) left center no-repeat `;
                        e.currentTarget.style.backgroundSize = "600px";
                      }
                      e.currentTarget.querySelector("h3").style.opacity = 1;
                      Array.from(
                        e.currentTarget.querySelectorAll(".fa")
                      ).forEach((icon) => {
                        icon.style.opacity = 1;
                      });
                    }}
                    onMouseLeave={(e) => {
                      if (image) {
                        e.currentTarget.style.background = actorImage;
                        e.currentTarget.style.backgroundSize = "300px";
                      }
                      e.currentTarget.querySelector("h3").style.opacity = 0;
                      Array.from(
                        e.currentTarget.querySelectorAll(".fa")
                      ).forEach((icon) => {
                        icon.style.opacity = 0;
                      });
                    }}
                  >
                    <div className={IndMovieStyle.border}>
                      <h3 className={IndMovieStyle["profile-person"]}>
                        {actor}
                      </h3>
                      <div className={IndMovieStyle["ind-movie-cast-icons"]}>
                        <i
                          className={`${IndMovieStyle["fa"]} ${IndMovieStyle["fa-instagram"]}`}
                          aria-hidden="true"
                        ></i>
                        <i
                          className={`${IndMovieStyle["fa"]} ${IndMovieStyle["fa-twitter"]}`}
                          aria-hidden="true"
                        ></i>
                        <i
                          className={`${IndMovieStyle["fa"]} ${IndMovieStyle["fa-facebook"]}`}
                          aria-hidden="true"
                        ></i>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}
