import { React } from "react";
import {
  MovieRuntime,
  MovieAverage,
  TruncateDescription,
} from "../Other/MovieComponents.js";
import {
  MovieCardActors,
  MovieCardGenres,
} from "../Other/MovieCardComponents.js";
import MovieCardStyle from "./moviecard.module.scss";
import PropTypes from "prop-types";

export default function MovieCard({
  poster,
  rating,
  runtime,
  genres,
  video,
  overview,
  actors,
}) {
  MovieCard.propTypes = {
    poster: PropTypes.string,
    rating: PropTypes.string,
    runtime: PropTypes.string,
    overview: PropTypes.string,
    video: PropTypes.string,

    genres: PropTypes.arrayOf(PropTypes.string),
    actors: PropTypes.arrayOf(PropTypes.string),
  };
  return (
    <div className="container">
      <div className={MovieCardStyle["cellphone-container"]}>
        <div className={MovieCardStyle.movie}>
          <div className={MovieCardStyle.menu}>
            <i className="material-icons"></i>
          </div>
          <div
            className={MovieCardStyle["movie-img"]}
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500/${poster})`,
            }}
          ></div>
          <div className={MovieCardStyle["text-movie-cont"]}>
            <div className={MovieCardStyle["mr-grid"]}>
              <div className={MovieCardStyle.col1}>
                <ul className={MovieCardStyle["movie-gen"]}>
                  <li>
                    <MovieAverage voteAverage={rating} />
                  </li>
                  <li>
                    <MovieRuntime runtime={runtime} />
                  </li>
                  <li>
                    <MovieCardGenres genres={genres} />
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["summary-row"]}`}
            >
              <div className={MovieCardStyle.col2}>
                <h5>SUMMARY</h5>
              </div>
              <div className={MovieCardStyle.col2}>
                <ul className={MovieCardStyle["movie-likes"]}>
                  <li>
                    <i className="material-icons">&#xE813;</i>
                    124
                  </li>
                  <li>
                    <i className="material-icons">&#xE813;</i>3
                  </li>
                </ul>
              </div>
            </div>
            <div className={MovieCardStyle["mr-grid"]}>
              <div className={MovieCardStyle.col1}>
                <p className={MovieCardStyle["movie-description"]}>
                  <TruncateDescription description={overview} />
                </p>
              </div>
            </div>
            <div
              className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["actors-row"]}`}
            >
              <div className={MovieCardStyle.col1}>
                <p className={MovieCardStyle["movie-actors"]}>
                  <MovieCardActors actors={actors} />
                </p>
              </div>
            </div>
            <div
              className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["action-row"]}`}
            >
              <div className={MovieCardStyle.col2}>
                <button
                  className={MovieCardStyle["watch-btn"]}
                  type="button"
                  onClick={() =>
                    (window.location.href = `https://www.youtube.com/watch?v=${video}`)
                  }
                >
                  <h3>
                    <i className="material-icons">&#xE037;</i>
                    WATCH TRAILER
                  </h3>
                </button>
              </div>
              <div
                className={`${MovieCardStyle["col6"]} ${MovieCardStyle["action-btn"]}`}
              >
                <i className="material-icons">&#xE161;</i>
              </div>
              <div
                className={`${MovieCardStyle["col6"]} ${MovieCardStyle["action-btn"]}`}
              >
                <i className="material-icons">&#xE866;</i>
              </div>
              <div
                className={`${MovieCardStyle["col6"]} ${MovieCardStyle["action-btn"]}`}
              >
                <i className="material-icons">&#xE80D;</i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
