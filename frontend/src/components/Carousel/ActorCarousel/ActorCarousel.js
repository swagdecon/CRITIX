import React from "react";
import PropTypes from "prop-types";
import ActorStyle from "./ActorCarousel.module.css";
import { Link } from "react-router-dom";

const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE;
const DEFAULT_TMDB_IMAGE = process.env.REACT_APP_DEFAULT_TMDB_IMAGE_PREFIX;
const defaultImage = `url(${DEFAULT_ACTOR_IMAGE}) center center no-repeat`;

export default function MovieActors({ actors }) {
  const defaultStyle = {
    background: defaultImage,
  };

  return (
    <div className={ActorStyle.Wrapper}>
      <div className={ActorStyle.responsiveGrid}>
        {actors.map((actor, i) => {
          const image = actor.profilePath;
          const actorImage = image ? `url(${DEFAULT_TMDB_IMAGE}${image})` : defaultImage;
          const style = image
            ? { background: actorImage, backgroundSize: "cover", backgroundPosition: "center" }
            : defaultStyle;

          return (
            <Link to={`/person/${actor.id}`} className={ActorStyle.Img} style={style} key={i}>
              <div className={ActorStyle.card}>
                <div className={ActorStyle.Img} style={style}>
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
            </Link>
          );
        })}
      </div>
    </div>
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