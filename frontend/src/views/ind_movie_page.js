import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../components/ind_movie/ind_movie.css";
import {
  MovieGenres,
  MovieTrailer,
  getYearFromDate,
} from "../components/movieCardfunctions";
const IndMovie = () => {
  const [movie, setMovie] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const myResponse = await fetch(`${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });

        if (myResponse.ok) {
          const responseData = await myResponse.json();
          setMovie(responseData);
        } else {
          console.log(`HTTP error! status: ${myResponse.status}`);
          navigate("/403", { replace: true });
        }
      } catch (error) {
        navigate("/403", { replace: true });
        console.log(error);
      }
    }

    fetchData();
  }, []);

  return (
    <html>
      <div-image
        style={{
          backgroundImage: `url(
            https://image.tmdb.org/t/p/w500/${movie.backdrop_path}
          )`,
        }}
      ></div-image>
      <ind-movie-body>
        <div className="ind-movie-wrapper">
          <ind-movie-nav>
            <form className="ind-movie-search" action="#" method="post">
              <div className="ind-movie_search__anim"></div>
              <button
                type="submit"
                className="ind-movie-search"
                value="Submit"
              ></button>
              <input type="text" name="name" placeholder="Search" />
            </form>
            <a className="filter" href="#">
              Filter
            </a>
          </ind-movie-nav>
          <div className="poster">
            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
          </div>

          <div id="fade" className="container-margin">
            <div className="ind-movie-header ">
              <div className="movie__score">
                {Math.round(movie.vote_average * 10)}%
              </div>
              <div className="movie__title__container">
                <h2 className="movie__title">{movie.title}</h2>
                <div className="movie__year">
                  {getYearFromDate(movie.release_date)}
                </div>
              </div>
              <MovieGenres genres={movie.genres} />
              <p className="movie__description">{movie.overview}</p>
              <a
                className="ind_movie__trailer"
                onClick={() => MovieTrailer(movie.video[0])}
              >
                <svg version="1.1">
                  <path d="M0.8,1.4L11.5,8L0.8,14.6V1.4 M0,0v16l13-8L0,0L0,0z" />
                </svg>
                <p>Trailer</p>
              </a>
            </div>
            <div className="ind_movie_review">
              <h3 className="ind_review__title">Reviews</h3>
              <ul>
                <li>
                  <div className="review__score">95%</div>
                  <p className="review__description">
                    &quot;Ex Machina&quot; deals with a familiar theme in a very
                    unique way. It doesn&apos;t bombard you with effects or
                    superficial action (although the robot effects are
                    exceptional). Rather, its focus and beauty lie in the subtle
                    and nuanced performances of its tiny cast as the film
                    explores what it means to be human.
                  </p>
                </li>
                <li>
                  <div className="review__score">91%</div>
                  <p className="review__description">
                    Quiet dialogue scenes between two characters are filmed in
                    such an impactful, making them feel hauntingly austere,
                    sweet and innocent, or terrible and frightening, through
                    meticulous use of composition, light and sound. The film
                    really does run the gamut of emotions, surprisingly funny
                    one minute and gut-wrenchingly tense and weird the next,
                    while the script twists and turns, constantly unsettling
                    your assumptions about what will happen.
                  </p>
                </li>
                <li>
                  <div className="review__score">89%</div>
                  <p className="review__description">
                    The performances are excellent, most notably Alicia Vikander
                    as the beguiling Ava, who absolutely passes for being
                    &apos;almost human &apos;. Her precise movements -walking,
                    standing or stooping to pull on a pair of stockings- have
                    just that slight tinge of the uncanny about them to suggest
                    a mechanical skeleton, yet she is undeniably seductive. You
                    can really understand Caleb &apos;s mental plight as she
                    begins to show signs of a sexual interest in him!
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </ind-movie-body>
    </html>
  );
};

export default IndMovie;
