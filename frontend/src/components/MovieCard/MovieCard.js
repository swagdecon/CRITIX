import React from "react";
import PropTypes from "prop-types";
import {
  MovieAverage,
  TruncateDescription,
  OpenLinkInNewTab
} from "../IndMovie/MovieComponents.js";
import FavouriteBtn from "../Other/btn/FavouriteBtn/FavouriteBtn.js"
import ShareIcon from '@mui/icons-material/Share';
import { MovieCardActors, MovieCardGenres } from "./MovieCardComponents.js";
import MovieCardStyle from "./moviecard.module.scss"
import { fetchData } from "../../security/Data.js"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import SharePagePopup from "../Other/SocialShare/SocialShare.js";
import WatchListBtn from "../Other/btn/WatchListBtn/WatchListBtn.js";
const trailerEndpoint = process.env.REACT_APP_TRAILER_ENDPOINT;

export default function MovieCard({
  movieId,
  title,
  posterUrl,
  voteAverage,
  genres,
  overview,
  actors,
  isSavedToWatchlist,
  isSavedToFavouriteMoviesList,
  shareUrl
}) {

  const data = {
    movieId,
    title,
    posterUrl,
    voteAverage,
    genres,
    overview,
    actors: actors ? actors.slice(0, 3) : null,
    isSavedToWatchlist,
    isSavedToFavouriteMoviesList
  };

  async function handleWatchTrailer(e) {
    e.preventDefault();
    const trailer = await fetchData(`${trailerEndpoint}${movieId}`);
    OpenLinkInNewTab(trailer)
    e.stopPropagation();
  }
  return (
    <div className="container">
      <div className={MovieCardStyle["cellphone-container"]}>
        <div className={MovieCardStyle.movie}>
          {/* <div className={MovieCardStyle.menu}>
            <i className="material-icons"></i>
          </div> */}
          <div
            className={MovieCardStyle["movie-img"]}
            style={{
              backgroundImage: `url(${posterUrl})`,
            }}
          />
          <div className={MovieCardStyle["text-movie-cont"]}>
            <div className={MovieCardStyle["mr-grid"]}>
              <div className={MovieCardStyle.col1}>
                <ul className={MovieCardStyle["movie-gen"]}>
                  <li>
                    <MovieAverage voteAverage={voteAverage} />
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
                {/* <ul className={MovieCardStyle["movie-likes"]}>
                  <li>
                    <i className="material-icons">&#xE813;</i>
                    124
                  </li>
                  <li>
                    <i className="material-icons">&#xE813;</i>
                  </li>
                </ul> */}
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
              className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["actors-row"]}`} >
              <div className={MovieCardStyle.col1}>
                {actors ?
                  <p className={MovieCardStyle["movie-actors"]}>
                    <MovieCardActors actors={actors} />
                  </p> : null}
              </div>
            </div>
            <div
              className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["action-row"]}`}
            >
              <div className={MovieCardStyle.col2}>
                <button
                  className={MovieCardStyle["watch-btn"]}
                  type="button"
                  onClick={handleWatchTrailer}
                >
                  <h3>
                    <i className="material-icons">&#xE037;</i>
                    WATCH TRAILER
                  </h3>
                </button>
              </div>
              <div className={MovieCardStyle.col6}>
                <div className={MovieCardStyle["action-btn"]}>
                  <WatchListBtn movieData={data} outline={false} />
                </div>
                <div className={MovieCardStyle["action-btn"]}>
                  <FavouriteBtn movieData={data} outline={false} />
                </div>
                <div className={MovieCardStyle["action-btn"]}>
                  <Popup trigger={
                    <i ><ShareIcon sx={{ fontSize: 30 }} onClick={(e) => e.preventDefault()} /></i>
                  } modal><SharePagePopup shareUrl={shareUrl} /> </Popup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

MovieCard.propTypes = {
  movieId: PropTypes.number,
  title: PropTypes.string,
  isSavedToWatchlist: PropTypes.bool,
  isSavedToFavouriteMoviesList: PropTypes.bool,
  posterUrl: PropTypes.string,
  voteAverage: PropTypes.number,
  runtime: PropTypes.number,
  overview: PropTypes.string,
  trailer: PropTypes.string,
  genres: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]),
  actors: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        character: PropTypes.string,
      })
    ),
    PropTypes.arrayOf(PropTypes.string),
  ]),
  shareUrl: PropTypes.string,
}
