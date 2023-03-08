import React, { useState, useEffect } from "react";
import "../misc/moviecard.scss";
import ajax from "../components/fetchService.js";
import "../misc/homepage.css";
import truncateDescription from "../components/movieCardfunctions.js";
import useLocalState from "../components/localStorage";
import HeroCarousel from "../components/HeroCarousel";
import Container from "../components/Container/Container";

const Homepage = () => {
  const [jwt] = useLocalState("", "jwt");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    ajax("api/movies/top_rated", "GET", jwt).then((data) => {
      console.log(data);
      setMovies(data);
    });
  }, []);

  return (
    <div>
      {/* NavBar */}
      <Container />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Movie Cards Below */}
      {movies.map((movie, i) => (
        <div className="card-container" key={i}>
          <div className="container">
            <div className="cellphone-container">
              <div className="movie">
                <div className="menu">
                  <i className="material-icons"></i>
                </div>
                <div className="movie-img">
                  <img
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className="text-movie-cont">
                  <div className="mr-grid">
                    <div className="col1">
                      {/* .replace ensures there is only one space inbetween words */}
                      {/* <h1>{movie.title.replace(/\s+/g, " ")}</h1> */}
                      <ul className="movie-gen">
                        <li>{Math.round(movie.vote_average * 10) / 10} </li>
                        <li>{movie.runtime} mins</li>
                        <li>{movie.genres.join(", ")}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mr-grid summary-row">
                    <div className="col2">
                      <h2>{movie.title}</h2>
                      {/* <p>{movie.release_date}</p> */}
                      {/* <p>{movie.tagline}</p> */}
                      <h5>SUMMARY</h5>
                    </div>
                    <div className="col2">
                      <ul className="movie-likes">
                        <li>
                          <i className="material-icons">&#xE813;</i>124
                        </li>
                        <li>
                          <i className="material-icons">&#xE813;</i>3
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mr-grid">
                    <div className="col1">
                      <p className="movie-description">
                        {truncateDescription(movie.overview)}
                      </p>
                    </div>
                  </div>
                  <div className="mr-grid actors-row">
                    <div className="col1">
                      <p className="movie-actors">
                        {movie.actors.slice(0, 3).map((actor, index) => {
                          if (index === 0) {
                            return actor;
                          } else if (index < 3) {
                            return `, ${actor}`;
                          } else {
                            return "";
                          }
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mr-grid action-row">
                    <div className="col2">
                      <button
                        className="watch-btn"
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
                    <div className="col6 action-btn">
                      <i className="material-icons">&#xE161;</i>
                    </div>
                    <div className="col6 action-btn">
                      <i className="material-icons">&#xE866;</i>
                    </div>
                    <div className="col6 action-btn">
                      <i className="material-icons">&#xE80D;</i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Homepage;
