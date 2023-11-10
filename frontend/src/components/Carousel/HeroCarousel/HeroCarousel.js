import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
import HeroStyle from "./HeroCarousel.module.scss";
import WatchTrailerBtn from "./WatchTrailerbtn";
import "../../Logo/Loader.js";
import { Link } from "react-router-dom";

const heroMovies = [
  {
    id: 872585,
    image:
      "https://www.themoviedb.org/t/p/original/xcXALwBjdHIjrESpGVhghqj8fGT.jpg",
    title: "OPPENHEIMER",
    tagline: "THE WORLD FOREVER CHANGES",
    genres: ["SCI-FI", "THRILLER", "DRAMA"],
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
  },
  {
    id: 575264,
    image:
      "https://www.themoviedb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg",
    title: "MISSION: IMPOSSIBLE - DEAD RECKONING",
    tagline: "WE ALL SHARE THE SAME FATE",
    genres: ["ACTION", "ADVENTURE"],
    trailerUrl: "https://www.youtube.com/watch?v=HurjfO_TDlQ",
  },
  {
    id: 414906,
    image:
      "https://www.themoviedb.org/t/p/original/b0PlSFdDwbyK0cf5RxwDpaOJQvQ.jpg",
    title: "THE BATMAN",
    tagline: "UNMASK THE TRUTH",
    genres: ["SCI-FI", "ACTION"],
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
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
    <Carousel className={HeroStyle["carousel-hero"]}>
      {heroMovies.map((movie) => (
        <Carousel.Item interval={5000} key={movie.id}>
          <Link to={`/movies/movie/${movie.id}`} className={HeroStyle["hero-movie-page"]}>
            <img
              className="d-block w-100"
              src={movie.image}
              alt={movie.title}
            />
          </Link>
          <Carousel.Caption>
            <h1 className={HeroStyle["hero_header"]}>{movie.title}</h1>
            <p className={HeroStyle["hero_tagline"]}>{movie.tagline}</p>
            <div className={HeroStyle["hero-genre-container"]}>
              {movie.genres.map((genre) => (
                <p className={HeroStyle["hero_genre"]} key={genre}>
                  {genre}
                </p>
              ))}
            </div>
            <Link
              className={HeroStyle["hero_trailer"]}
              to={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button type="button" className="btn btn-warning">
                <WatchTrailerBtn />{" "}
                WATCH TRAILER
              </button>
            </Link>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
