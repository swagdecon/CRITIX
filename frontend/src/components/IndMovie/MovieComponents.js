import { React } from "react";
import PropTypes from "prop-types";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
import ReactPlayer from "react-player";
import "../Carousel/MovieCarousel/MovieCarousel.module.css";
import GlassCard from "./GlassCard";
import NoTrailer from "./NoTrailerAvailable.png"
import GlassStyle from "./GlassCard.module.css"
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

  return (
    <div>
      {video ? (
        <div className={IndMovieStyle.EmbeddedMovieTrailer}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${video}`}
            controls={true}
            playing={false}
            width="60vw"
            height="70vh"
          />
        </div>
      ) : <img
        className={IndMovieStyle.indMovieEmbeddedTrailer}
        src={NoTrailer}
        alt="Movie Trailer Unavailable"
        width={"100%"}
        height={"100%"}
      />
      }
    </div>
  );
}

EmbeddedMovieTrailer.propTypes = {
  video: PropTypes.arrayOf(PropTypes.string),
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
    <div className={GlassStyle["info-wrapper"]}>
      <div className={GlassStyle["info-container-wrapper"]}>
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
  MovieDetails,
};
