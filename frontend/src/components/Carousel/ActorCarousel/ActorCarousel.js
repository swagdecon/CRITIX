import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PropTypes from "prop-types"
import ActorStyle from "./ActorCarousel.module.css";
import Title from "../title.module.scss";

const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE;
const DEFAULT_TMDB_IMAGE = process.env.REACT_APP_DEFAULT_TMDB_IMAGE_PREFIX;
const defaultImage = `url(${DEFAULT_ACTOR_IMAGE}) center center no-repeat`;

export default function MovieActors({ actors }) {


  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 2500,
        settings: {
          slidesToShow: 9,
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

  const defaultStyle = {
    background: defaultImage,
  };
  return (
    <div>
      <h3 className={`${Title["movie-title"]} ${Title["ind-movie-actors"]}`}>cast members:</h3>
      <Slider {...settings}>
        {actors.map((actor, i) => {
          const image = actor.profilePath
          const actorImage = image ? `url(${DEFAULT_TMDB_IMAGE}${image})` : defaultImage;
          const style = image ? { background: actorImage, backgroundSize: "300px" } : defaultStyle;
          return (
            <div className={ActorStyle.card} key={i}>
              <div className={ActorStyle.Img} style={style} >

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
            </div>
          );
        })}
      </Slider >
    </div >
  );
}

MovieActors.propTypes = {
  actors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      profilePath: PropTypes.string,
    })
  ),
};
