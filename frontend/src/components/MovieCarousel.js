import { React, useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import truncateDescription from "../components/movieCardfunctions.js";
import PropTypes from "prop-types";
// Library that can perform array manipulation, in this case, splitting the movie into chunks of 5 to then loop over:
import { chunk } from "lodash";

const MovieCarousel = ({ endpoint }) => {
  const [movies, setMovies] = useState([]);

  const movieChunks = chunk(movies, 5);
  //The chunk() method takes two arguments: the first argument is the array to be chunked, and the second argument (optional) is the size of each chunk. In this case, we pass 5 as the size of each chunk.

  // The chunk() method returns an array of sub-arrays, where each sub-array contains 5 movies or less. We then use the same map() method as before to render the carousel slides and movie cards.
  MovieCarousel.propTypes = {
    endpoint: PropTypes.array.isRequired,
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const myResponse = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });

        if (myResponse.ok) {
          const responseJson = await myResponse.json();
          setMovies(responseJson);
        } else {
          console.log(`HTTP error! status: ${myResponse.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, [endpoint]);

  return (
    <Carousel>
      {movieChunks.map((chunk, i) => (
        <Carousel.Item key={i}>
          {chunk.map((movie, j) => (
            <div className="card-container" key={`${i}-${j}`}>
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
                              <i className="material-icons">&#xE813;</i>
                              124
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
                              <i className="material-icons">&#xE037;</i>
                              WATCH TRAILER
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
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MovieCarousel;
