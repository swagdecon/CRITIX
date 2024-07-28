import { React } from "react";
import PropTypes from "prop-types";
import ActorStyle from "./ActorCarousel.module.css";
import Title from "../title.module.scss";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE;
const DEFAULT_TMDB_IMAGE = process.env.REACT_APP_DEFAULT_TMDB_IMAGE_PREFIX;
const defaultImage = `url(${DEFAULT_ACTOR_IMAGE}) center center no-repeat`;

const settings = {
  dots: false,
  infinite: true,
  speed: 1000,
  slidesToShow: 7,
  slidesToScroll: 5,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 3350,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 5,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 2850,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
        infinite: true,
        dots: false
      }
    },
    {
      breakpoint: 2450,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 5,
        initialSlide: 2
      }
    },
    {
      breakpoint: 1950,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 1420,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 950,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};

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

  const defaultStyle = {
    background: defaultImage,
  };

  if (actors.length > 0) {
    return (
      <>
        <h3 className={`${Title["movie-title"]} ${Title["ind-movie-actors"]}`}>
          cast members
        </h3>
        <Slider
          className={ActorStyle["carousel-actors"]}
          {...settings}
        >
          {actors.map((actor, index) => {
            const image = actor.profilePath;
            const actorImage = image
              ? `url(${DEFAULT_TMDB_IMAGE}${image}) center center no-repeat`
              : defaultImage;
            const style = image
              ? { background: actorImage, backgroundSize: "300px" }
              : defaultStyle;
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
        </Slider>
      </>
    );
  } else {
    return (
      <div>
        Cast List unavailable
      </div>
    );
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