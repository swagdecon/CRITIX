import React from "react";
import { Carousel } from "react-bootstrap";
import "./ActorCarousel.css";
import PropTypes from "prop-types";
import IndMovieStyle from "../../IndMovie/ind_movie.module.css";
import Title from "../title.module.scss";
import { Link } from "react-router-dom";
const defaultImage = "url(https://i.pinimg.com/736x/83/bc/8b/83bc8b88cf6bc4b4e04d153a418cde62.jpg) center center no-repeat";

function onMouseEnter(e, image) {
  const target = e.currentTarget;
  if (image) {
    target.style.background = `url(https://image.tmdb.org/t/p/w500${image}) left center no-repeat `;
    target.style.backgroundSize = "600px";
  }
  target.querySelector("h3").style.opacity = 1;
  const icons = target.querySelectorAll(".fa");
  icons.forEach((icon) => {
    icon.style.opacity = 1;
  });
}


function onMouseLeave(e, image, actorImage) {
  const target = e.currentTarget;
  if (image) {
    target.style.background = actorImage;
    target.style.backgroundSize = "300px";
  }
  target.querySelector("h3").style.opacity = 0;
  const icons = target.querySelectorAll(".fa");
  icons.forEach((icon) => {
    icon.style.opacity = 0;
  });
}


export default function MovieActors({ actors }) {
  const actorChunks = [];
  const chunkSize = 5;
  if (actors) {
    for (let i = 0; i < actors.length; i += chunkSize) {
      actorChunks.push(actors.slice(i, i + chunkSize));
    }
    const defaultStyle = {
      background: defaultImage,
    };
    return (
      <div>
        <h3 className={`${Title["movie-title"]}`}>cast members:</h3>
        <Carousel className="carousel-actors" interval={null} indicators={false}>
          {actorChunks.map((chunk, chunkIndex) => (
            <Carousel.Item key={chunkIndex}>
              <div className={IndMovieStyle["profile-container"]}>
                {chunk.map((actor, index) => {
                  const image = actor.profilePath ? actor.profilePath : null;
                  const actorImage = image ? `url(https://image.tmdb.org/t/p/w500${image}) center center no-repeat` : defaultImage;
                  const style = image ? { background: actorImage, backgroundSize: "300px" } : defaultStyle;
                  return (
                    <div
                      key={index}
                      className={`${IndMovieStyle["card"]} ${IndMovieStyle["card1"]}`}
                      style={style}
                      onMouseEnter={(e) => onMouseEnter(e, image)}
                      onMouseLeave={(e) => onMouseLeave(e, image, actorImage)}
                    >
                      <Link to={`/person/${actor.id}`}>
                        <div className={IndMovieStyle.border}>
                          <h3 className={IndMovieStyle["profile-person"]}>
                            {actor.name}
                          </h3>
                          <div className={IndMovieStyle["ind-movie-cast-icons"]}>
                            <i
                              className={`${IndMovieStyle["fa"]} ${IndMovieStyle["fa-instagram"]}`}
                              aria-hidden="true"
                            />
                            <i
                              className={`${IndMovieStyle["fa"]} ${IndMovieStyle["fa-twitter"]}`}
                              aria-hidden="true"
                            />
                            <i
                              className={`${IndMovieStyle["fa"]} ${IndMovieStyle["fa-facebook"]}`}
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    );
  } else {
    return null
  }
}
MovieActors.propTypes = {
  actors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      profilePath: PropTypes.string,
    })
  ),
  images: PropTypes.arrayOf(PropTypes.string),
};