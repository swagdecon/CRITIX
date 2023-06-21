import { React, useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";

import ReactPlayer from "react-player";

import "../Carousel/MovieCarousel/MovieCarousel.css";
import GlassCard from "./GlassCard";
function TruncateDescription({ description }) {
  const words = description.split(" ");

  if (words.length > 30) {
    if (!words || words === null || words.length === 0) {
      return "No Description Available";
    }
    const truncated = words.slice(0, 30).join(" ");
    return truncated + "...";
  }

  return description;
}

function MovieRuntime({ runtime }) {
  if (!runtime) {
    return "No Runtime Available";
  }
  return `${runtime} mins |`;
}

function GetYearFromDate(dateString) {
  if (!dateString) {
    return null;
  }
  const year = dateString.split("-")[0];
  return year;
}
function MovieTrailer(url) {
  if (!url) {
    return;
  }
  return window.open(`https://www.youtube.com/watch?v=${url}`);
}

function MovieAverage({ voteAverage }) {
  if (!voteAverage) {
    return "No Rating";
  }
  let rating = parseFloat(voteAverage).toFixed(1);
  return rating;
}

function MovieGenres({ genres }) {
  if (!genres) {
    return "";
  }
  MovieGenres.propTypes = {
    genres: PropTypes.arrayOf(PropTypes.string),
  };
  return (
    <ul className={IndMovieStyle.movie__type}>
      {genres.map((genre) => (
        <li key={genre}>{genre}</li>
      ))}
    </ul>
  );
}
function ParseNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function EmbeddedMovieTrailer({ video }) {
  EmbeddedMovieTrailer.propTypes = {
    video: PropTypes.arrayOf(PropTypes.string),
  };
  // if (video !== null) {
  return (
    <ReactPlayer
      className={IndMovieStyle.indMovieEmbeddedTrailer}
      url={`https://www.youtube.com/watch?v=${video}`}
      controls={true}
      playing={false}
      width={"60vw"}
      height={"60vh"}
    />
  );
  // } else {
  //   // return <div>No Trailer Available</div>;
  // }
}
function MovieReviews({ reviews }) {
  MovieReviews.propTypes = {
    reviews: PropTypes.arrayOf(PropTypes.string),
  };
  if (!reviews) {
    return (
      <div className={IndMovieStyle["no-reviews"]}>No Reviews Available</div>
    );
  }
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
          {/* <div className="review__score">{review.rating}%</div> */}
          <p className={IndMovieStyle.review__description}>{review}</p>
          <br />
        </ReactTextCollapse>
      ))}
    </div>
  );
}

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
  GetYearFromDate,
  MovieRuntime,
  ParseNumber,
  MovieTrailer,
  MovieAverage,
  EmbeddedMovieTrailer,
  MovieGenres,
  MovieReviews,
  MovieDetails,
};
