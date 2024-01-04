import { React, useState } from "react";
import { Carousel } from "react-bootstrap";
import PropTypes from "prop-types";
import { chunk } from "lodash";
import { getChunkSize, useWindowResizeEffect } from "../CarouselHelpers"
import ActorStyle from "./ActorCarousel.module.css";
import Title from "../title.module.scss";
// import { Link } from "react-router-dom";
const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE;
const DEFAULT_TMDB_IMAGE = process.env.REACT_APP_DEFAULT_TMDB_IMAGE_PREFIX;
const ACTOR_CAROUSEL_BREAKPOINT = JSON.parse(process.env.REACT_APP_ACTOR_CAROUSEL_BREAKPOINTS)
const defaultImage = `url(${DEFAULT_ACTOR_IMAGE}) center center no-repeat`;

function onMouseEnter(e, image) {
  const target = e.currentTarget;
  if (image) {
    target.style.backgroundImage = `url(${DEFAULT_TMDB_IMAGE}${image})`;
    target.style.backgroundPosition = 'left center';
    target.style.backgroundRepeat = 'no-repeat';
    target.style.backgroundSize = '600px';
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
    target.style.backgroundImage = `url(${DEFAULT_TMDB_IMAGE}${actorImage})`;
    target.style.backgroundSize = '300px';
  }
  target.querySelector("h3").style.opacity = 0;
  const icons = target.querySelectorAll(".fa");
  icons.forEach((icon) => {
    icon.style.opacity = 0;
  });
}

const CarouselArrowStyles = `
.carousel-control-prev,
.carousel-control-next {
  flex: 1;
  width: 30px;
  margin: 0 5px;
}`

export default function MovieActors({ actors }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useWindowResizeEffect(setWindowWidth);
  console.log(windowWidth)

  const actorChunks = chunk(actors, getChunkSize(windowWidth, ACTOR_CAROUSEL_BREAKPOINT));
  const defaultStyle = {
    background: defaultImage,
  };

  return (
    <div>
      <h3 className={`${Title["movie-title"]} ${Title["ind-movie-actors"]}`}>cast members:</h3>
      <Carousel className={ActorStyle["carousel-actors"]} interval={null} indicators={false} >
        {actorChunks.map((movieChunk, chunkIndex) => (
          <Carousel.Item key={chunkIndex}>
            <div className={ActorStyle["profile-container"]}>
              {movieChunk.map((actor, index) => {
                const image = actor.profilePath
                const actorImage = image ? `url(${DEFAULT_TMDB_IMAGE}${image}) center center no-repeat` : defaultImage;
                const style = image ? { background: actorImage, backgroundSize: "300px" } : defaultStyle;
                return (
                  <div
                    key={index}
                    className={`${ActorStyle.card} ${ActorStyle.card1}`}
                    style={style}
                    onMouseEnter={(e) => onMouseEnter(e, image)}
                    onMouseLeave={(e) => onMouseLeave(e, image, actorImage)}
                  >
                    <div className={ActorStyle.border}>
                      <h3 className={ActorStyle["profile-person"]}>
                        {actor.name}
                      </h3>
                    </div>
                  </div>
                );
              })}
            </div>
          </Carousel.Item>
        ))}
        <style>{CarouselArrowStyles}</style>
      </Carousel>
    </div>
  )
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