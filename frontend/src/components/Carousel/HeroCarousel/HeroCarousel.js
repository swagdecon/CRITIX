import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
import "./HeroCarousel.css";
import WatchTrailerBtn from "./WatchTrailerbtn";
import "../../Logo/Loader.js";
import "./WatchTrailerBtn.css";
import { Link } from "react-router-dom";

const heroMovies = [
  {
    id: 335984,
    image:
      "https://www.themoviedb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg",
    title: "BLADE RUNNER 2049",
    tagline: "THE KEY TO THE FUTURE IS FINALLY UNEARTHED.",
    genres: ["SCI-FI", "THRILLER", "DRAMA"],
    trailerUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4",
  },
  {
    id: 330459,
    image:
      "https://www.themoviedb.org/t/p/original/6t8ES1d12OzWyCGxBeDYLHoaDrT.jpg",
    title: "ROGUE ONE: A STAR WARS STORY",
    tagline: "A REBELLION BUILT ON HOPE.",
    genres: ["SCI-FI", "ACTION", "ADVENTURE"],
    trailerUrl: "https://www.youtube.com/watch?v=frdj1zb9sMY",
  },
  {
    id: 157336,
    image:
      "https://www.themoviedb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    title: "INTERSTELLAR",
    tagline: "MANKIND WAS BORN ON EARTH. IT WAS NEVER MEANT TO DIE HERE.",
    genres: ["SCI-FI", "DRAMA", "ADVENTURE"],
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
  },
  {
    id: 27205,
    image:
      "https://www.themoviedb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
    title: "INCEPTION",
    tagline: "YOUR MIND IS THE SCENE OF THE CRIME",
    genres: ["SCI-FI", "ACTION", "ADVENTURE"],
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  },

  {
    id: 286217,
    image:
      "https://www.themoviedb.org/t/p/original/lzMS0CI3FLQYC5EgJoWeIaEt0lm.jpg",
    title: "THE MARTIAN",
    tagline: "BRING HIM HOME.",
    genres: ["SCI-FI", "DRAMA", "ADVENTURE"],
    trailerUrl: "https://www.youtube.com/watch?v=ej3ioOneTy8",
  },
];
export default function HeroCarousel() {
  return (
    <Carousel>
      {heroMovies.map((movie) => (
        <Carousel.Item interval={5000} key={movie.id}>
          <Link to={`/movies/movie/${movie.id}`} className="hero-movie-page">
            <img
              className="d-block w-100"
              src={movie.image}
              alt={movie.title}
            />
          </Link>
          <Carousel.Caption>
            <h1 className="hero_header">{movie.title}</h1>
            <p className="hero_tagline">{movie.tagline}</p>
            <div className="hero_genre-container">
              {movie.genres.map((genre) => (
                <p className="hero_genre" key={genre}>
                  {genre}
                </p>
              ))}
            </div>
            <Link
              className="hero_trailer"
              to={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button" className="btn btn-warning ">
                <WatchTrailerBtn />
                WATCH TRAILER
              </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
