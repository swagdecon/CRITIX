import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import Container from "../components/Container/Container";
import LoadingPage from "../../views/LoadingPage";
import { useNavigate } from "react-router-dom";
import MovieCardStyle from "../../misc/moviecard.module.scss";
import axios from "axios";
import { useParams } from "react-router-dom";

import {
  MovieRuntime,
  MovieAverage,
  TruncateDescription,
} from "../Other/movieComponents.js";

import {
  MovieCardActors,
  MovieCardGenres,
} from "../Other/MovieCardComponents.js";
export default function MovieListInTheatres() {
  const [movie, setMovie] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const navigate = useNavigate();
  const { endpoint } = useParams();
  console.log(endpoint);

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const response = await axios.get(`now_playing`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });
        setMovie(response.data);
        setDataLoaded(true);
      } catch (error) {
        navigate("/403", { replace: true });
        console.log(error);
      }
    }

    if (prevId !== endpoint) {
      // compare current url id with previous url id
      setRequestSent(false); // reset requestSent state variable
      setDataLoaded(false); // reset dataLoaded state variable
      setPrevId(endpoint); // update previous id state variable
    }

    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, endpoint, navigate, prevId]); // add prevId as a dependency
  if (!dataLoaded) {
    <LoadingPage />;
  }
  console.log(movie);
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>

      <body>
        <div className={MovieCardStyle["main-card-container"]}>
          <Link to={`${endpoint}`}>
            <div className="container">
              <div className={MovieCardStyle["cellphone-container"]}>
                <div className={MovieCardStyle.movie}>
                  <div className={MovieCardStyle.menu}>
                    <i className="material-icons"></i>
                  </div>
                  <div
                    className={MovieCardStyle["movie-img"]}
                    style={{
                      backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.posterPath})`,
                    }}
                  ></div>
                  <div className={MovieCardStyle["text-movie-cont"]}>
                    <div className={MovieCardStyle["mr-grid"]}>
                      <div className={MovieCardStyle.col1}>
                        <ul className={MovieCardStyle["movie-gen"]}>
                          <li>
                            <MovieAverage voteAverage={movie.voteAverage} />
                          </li>
                          <li>
                            <MovieRuntime runtime={movie.runtime} />
                          </li>
                          <li>
                            <MovieCardGenres genres={movie.genres} />
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
                          <TruncateDescription description={movie.overview} />
                        </p>
                      </div>
                    </div>
                    <div
                      className={`${MovieCardStyle["mr-grid"]} ${MovieCardStyle["actors-row"]}`}
                    >
                      <div className={MovieCardStyle.col1}>
                        <p className={MovieCardStyle["movie-actors"]}>
                          <MovieCardActors actors={movie.actors} />
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
                            (window.location.href = `https://www.youtube.com/watch?v=${movie.video[0]}`)
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
          </Link>
        </div>
      </body>
    </html>
  );
}
