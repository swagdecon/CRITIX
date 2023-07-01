import { React } from "react";
import {
  MovieRuntime,
  MovieAverage,
  TruncateDescription,
  MovieTrailer,
} from "../IndMovie/MovieComponents.js";
import { MovieCardActors, MovieCardGenres } from "./MovieCardComponents.js";
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
          />
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
                    video[0]
                      ? // video is saved in the db as an array, (for recommended carouseL) but for ind_movie it is just ${video}
                      MovieTrailer(video[0])
                      : MovieTrailer(video)
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
MovieCard.propTypes = {
  poster: PropTypes.string,
  rating: PropTypes.number,
  runtime: PropTypes.number,
  overview: PropTypes.string,
  video: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.bool,
  ]),
  genres: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),

  actors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      character: PropTypes.string,
    })
  ),
};