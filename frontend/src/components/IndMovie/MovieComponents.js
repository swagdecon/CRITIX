import { React, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import ReactPlayer from "react-player";
import "../Carousel/MovieCarousel/MovieCarousel.css";
import GlassCard from "./GlassCard";
import NoTrailer from "./NoTrailerAvailable.png"

function TruncateDescription({ description }) {
  const words = description.split(" ");

  if (!words || words === null || words.length === 0) {
    return "No Description Available";
  }
  const numWords = words.length;

  if (numWords > 30) {

    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
}


function MovieRuntime({ runtime }) {
  runtime ? `${runtime} mins |` : "No Runtime Available";
}


function ParseDate({ date }) {
  const year = date ? date.split("-")[0] : null;
  return year;
}


function MovieTrailer(url) {
  url ? window.open(`https://www.youtube.com/watch?v=${url}`) : null
}


function MovieAverage({ voteAverage }) {
  const rating = parseFloat(voteAverage).toFixed(1);

  voteAverage ? rating : "No Rating";
}


function MovieGenres({ genres }) {
  genres ?
    (
      <ul className={IndMovieStyle.movie__type}>
        {genres.map((genre) => (
          <li key={genre}>{genre}</li>
        ))}
      </ul>
    ) : ""
}

MovieGenres.propTypes = {
  genres: PropTypes.arrayOf(PropTypes.string),
};


function ParseNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function EmbeddedMovieTrailer({ video }) {

  const [playerWidth, setPlayerWidth] = useState("60vw");
  const [playerHeight, setPlayerHeight] = useState("60vh");

  useEffect(() => {
    const handleResize = () => {
      // Adjust the width and height based on media queries
      if (window.innerWidth < 768) {
        setPlayerWidth("100%");
        setPlayerHeight("300px");
      } else if (window.innerWidth > 1200) {
        setPlayerWidth("58vw");
        setPlayerHeight("60vh");
      } else {
        setPlayerWidth("60vw");
        setPlayerHeight("60vh");
      }
    };

    // Call the handleResize function initially and whenever the window is resized
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {video ? (

        <ReactPlayer
          className={IndMovieStyle.indMovieEmbeddedTrailer}
          url={`https://www.youtube.com/watch?v=${video}`}
          controls={true}
          playing={false}
          width={playerWidth}
          height={playerHeight}
        />
      ) : <img
        className={IndMovieStyle.indMovieEmbeddedTrailer}
        src={NoTrailer}
        alt="Movie Trailer Unavailable"
        width={1520}
        height={825}
      />
      }
    </div>
  );

}

EmbeddedMovieTrailer.propTypes = {
  video: PropTypes.arrayOf(PropTypes.string),
};
function MovieReviews({ reviews }) {

  if (!reviews) {
    return (
      <div className={IndMovieStyle["no-reviews"]}>No Reviews Available</div>
    );
  } else {
    const [maxHeight, setMaxHeight] = useState(500);

    const reviewRef = useRef(null);
    useEffect(() => {
      if (reviewRef.current) {
        const reviewHeight = reviewRef.current.offsetHeight;
        setMaxHeight(reviewHeight);
      }
    }, [reviews]);

    const TEXT_COLLAPSE_OPTIONS = {
      collapse: false,
      collapseText: "... show more",
      expandText: "show less",
      minHeight: 210,
      maxHeight: 500,
      textStyle: {
        color: "white",
        fontSize: "20px",
      },
    };

    return (
      <div className={IndMovieStyle.review__wrapper}>
        {reviews.slice(0, 3).map((review, index) => (
          <ReactTextCollapse
            key={index}
            options={{ ...TEXT_COLLAPSE_OPTIONS, maxHeight }}
          >
            <div className="review__score">{review.rating}%</div>
            <p className={IndMovieStyle.review__description}>{review}</p>
            <br />
          </ReactTextCollapse>
        ))}
      </div>
    );
  }
}
MovieReviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.string),
};

function MovieDetails({
  runtime,
  revenue,
  budget,
  voteCount,
  language,
  productionCompanies,
  movieStatus,
  releaseDate,
}) {
  return (
    <div>
      <div className="info-container-1">
        <GlassCard
          name={"RUNTIME"}
          value={runtime}
          icon="&#xe8b5;"
          iconString={"&#xe8b5;"}
        />
        <GlassCard
          name={"BUDGET"}
          value={budget}
          iconString={"&#xef63;"}
          icon="&#xef63;"
        />
        <GlassCard
          name={"REVENUE"}
          value={revenue}
          iconString={"&#xf041;"}
          icon="&#xf041;"
        />
        <GlassCard
          name={"VOTE COUNT"}
          value={voteCount}
          iconString={"&#xe175;"}
          icon="&#xe175;"
        />
      </div>
      <br />
      <div className="info-container-2">
        <GlassCard
          name={"LANGUAGE"}
          value={language}
          iconString={"&#xe8e2;"}
          icon="&#xe8e2;"
        />
        <GlassCard
          name={"PRODUCTION"}
          value={productionCompanies}
          iconString={"&#xe04b;"}
          icon="&#xe04b;"
        />
        <GlassCard
          name={"MOVIE STATUS"}
          value={movieStatus}
          iconString={"&#xf7f3;"}
          icon="&#xf7f3;"
        />
        <GlassCard
          name={"Release Date"}
          value={releaseDate}
          iconString={"&#xebcc;"}
          icon="&#xebcc;"
        />
      </div>
    </div>
  );
}
MovieDetails.propTypes = {
  runtime: PropTypes.number,
  revenue: PropTypes.number,
  budget: PropTypes.number,
  voteCount: PropTypes.number,

  language: PropTypes.string,
  productionCompanies: PropTypes.arrayOf(PropTypes.string),
  movieStatus: PropTypes.string,
  releaseDate: PropTypes.string,
};

export {
  TruncateDescription,
  ParseDate,
  MovieRuntime,
  ParseNumber,
  MovieTrailer,
  MovieAverage,
  EmbeddedMovieTrailer,
  MovieGenres,
  MovieReviews,
  MovieDetails,
};
