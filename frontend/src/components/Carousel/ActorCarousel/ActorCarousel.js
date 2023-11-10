import { React, useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import PropTypes from "prop-types";
import { chunk } from "lodash";

import ActorStyle from "./ActorCarousel.module.css";
import Title from "../title.module.scss";
// import { Link } from "react-router-dom";
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
    switch (true) {
      case windowWidth < 645:
        return 1;
      case windowWidth <= 949:
        return 2;
      case windowWidth <= 1300:
        return 3;
      case windowWidth <= 1555:
        return 4;
      case windowWidth <= 1869:
        return 5;
      case windowWidth <= 2181:
        return 6;
      case windowWidth <= 2300:
        return 7;
      default:
        return 5;
    }
  };


  const actorChunks = chunk(actors, getChunkSize());

  const defaultStyle = {
    background: defaultImage,
  };
  return (
    <div>
      <h3 className={`${Title["movie-title"]}`}>cast members:</h3>
      <Carousel className={ActorStyle["carousel-actors"]} interval={null} indicators={false} >
        {actorChunks.map((chunk, chunkIndex) => (
          <Carousel.Item key={chunkIndex}>
            <div className={ActorStyle["profile-container"]}>
              {chunk.map((actor, index) => {
                const image = actor.profilePath ? actor.profilePath : null;
                const actorImage = image ? `url(https://image.tmdb.org/t/p/w500${image}) center center no-repeat` : defaultImage;
                const style = image ? { background: actorImage, backgroundSize: "300px" } : defaultStyle;
                return (
                  <div
                    key={index}
                    className={`${ActorStyle.card} ${ActorStyle.card1}`}
                    style={style}
                    onMouseEnter={(e) => onMouseEnter(e, image)}
                    onMouseLeave={(e) => onMouseLeave(e, image, actorImage)}
                  >
                    {/* <Link to={`/person/${actor.id}`}> */}
                    <div className={ActorStyle.border}>
                      <h3 className={ActorStyle["profile-person"]}>
                        {actor.name}
                      </h3>
                      {/* <div className="ind-movie-cast-icons">
                            <i
                              className={"fa fa-instagram"}
                              aria-hidden="true"
                            />
                            <i
                              className={"fa fa-twitter"}
                              aria-hidden="true"
                            />
                            <i
                              className={"fa fa-facebook"}
                              aria-hidden="true"
                            />
                          </div> */}
                    </div>
                    {/* </Link> */}
                  </div>
                );
              })}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <style >{`
        .carousel-control-prev,
        .carousel-control-next {
          flex: 1;
          width: 30px;
          align-self: center;
          margin: 0 5px;
        }
`} </style>
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
  images: PropTypes.arrayOf(PropTypes.string),
};