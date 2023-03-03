import React, { useState, useEffect } from "react";
import "../misc/moviecard.scss";
import ajax from "../components/fetchService.js";
import "../misc/homepage.css";
import truncateDescription from "../components/movieCardfunctions.js";
import useLocalState from "../components/localStorage";
import HeroCarousel from "../components/HeroCarousel";
// import Navbar from "../components/NavBar/Navbar";
// import Header from "../components/Header/Header";
import Container from "../components/Container/Container";

const Homepage = () => {
  const [jwt] = useLocalState("", "jwt");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    ajax("api/movies/popular", "GET", jwt).then((data) => {
      console.log(data);
      setMovies(data);
    });
  }, []);

  return (
    <html>
      <body>
        <div>
          {/* NavBar */}
          {/* <Navbar /> */}
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
                    <div
                      className="movie-img"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w500/${movie.poster_path})`,
                      }}
                    ></div>
                    <div className="text-movie-cont">
                      <div className="mr-grid">
                        <div className="col1">
                          {/* .replace ensures there is only one space inbetween words */}
                          {/* <h1>{movie.title.replace(/\s+/g, " ")}</h1> */}
                          <ul className="movie-gen">
                            <li>{movie.vote_average} /</li>
                            <li>2h 49min /</li>
                            <li>Adventure, Drama, Sci-Fi,</li>
                          </ul>
                        </div>
                      </div>
                      <div className="mr-grid summary-row">
                        <div className="col2">
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
                            Matthew McConaughey, Anne Hathaway, Jessica Chastain
                          </p>
                        </div>
                      </div>
                      <div className="mr-grid action-row">
                        <div className="col2">
                          <div className="watch-btn">
                            <h3>
                              <i className="material-icons">&#xE037;</i>WATCH
                              TRAILER
                            </h3>
                          </div>
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
      </body>
    </html>
  );
};

export default Homepage;
