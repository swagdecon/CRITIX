import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types"
import ActorStyle from "./ActorCarousel.module.css";
import Title from "../title.module.scss";

const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE;
const DEFAULT_TMDB_IMAGE = process.env.REACT_APP_DEFAULT_TMDB_IMAGE_PREFIX;
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
export default function MovieActors({ actors }) {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    arrows: true,
    infinite: false,
    slidesToShow: 5, // Adjust the number of slides to display
    slidesToScroll: 1,
  };
  const defaultStyle = {
    background: defaultImage,
  };

  return (
    <div>
      <h3 className={`${Title["movie-title"]} ${Title["ind-movie-actors"]}`}>cast members:</h3>
      <Slider {...settings} ref={sliderRef}>
        {actors.map((actor, index) => {
          const image = actor.profilePath
          const actorImage = image ? `url(${DEFAULT_TMDB_IMAGE}${image}) center center no-repeat` : defaultImage;
          const style = image ? { background: actorImage, backgroundSize: "300px" } : defaultStyle;
          return (
            <div
              key={index}
              className={ActorStyle.card}
              style={style}
              onMouseEnter={(e) => onMouseEnter(e, image)}
              onMouseLeave={(e) => onMouseLeave(e, image, actorImage)}
            >
              <div className={ActorStyle.border}>
                <h3 className={ActorStyle["profile-person"]}>
                  {actor.name}
                </h3>
                <div className={ActorStyle.icons}>
                  <i className={`fa fa-instagram ${ActorStyle.iconEl}`} aria-hidden="true"></i>
                  <i className={`fa fa-twitter ${ActorStyle.iconEl}`} aria-hidden="true"></i>
                  <i className={`fa fa-facebook ${ActorStyle.iconEl}`} aria-hidden="true"></i>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}

MovieActors.propTypes = {
  actors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      profilePath:
        PropTypes.string,
    })
  ),
};