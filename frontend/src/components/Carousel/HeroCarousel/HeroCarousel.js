import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Carousel from "react-bootstrap/Carousel";
import "./HeroCarousel.css";
import WatchTrailerBtn from "./WatchTrailerbtn";
import "../../Logo/Loader.js";
import "./WatchTrailerBtn.css";
import { Link } from "react-router-dom";
export default function HeroCarousel() {
  return (
    <Carousel>
      <Carousel.Item interval={5000}>
        <Link to={`/api/movies/movie/335984`} className="hero-movie-page">
          <img
            className="d-block w-100"
            src="https://www.themoviedb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h1 className="hero_header">BLADE RUNNER 2049</h1>
            <p className="hero_tagline">
              THE KEY TO THE FUTURE IS FINALLY UNEARTHED.
            </p>
            <div className="hero_genre-container">
              <p className="hero_genre">SCI-FI</p>
              <p className="hero_genre">THRILLER</p>
              <p className="hero_genre">DRAMA</p>
            </div>
            <a
              className="hero_trailer"
              href="https://www.youtube.com/watch?v=gCcx85zbxz4"
            >
              <button type="button" className="btn btn-warning">
                <WatchTrailerBtn />
                WATCH TRAILER
              </button>
            </a>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

      <Carousel.Item interval={5000}>
        <Link to={`/api/movies/movie/330459`} className="hero-movie-page">
          <img
            className="d-block w-100"
            src="https://www.themoviedb.org/t/p/original/6t8ES1d12OzWyCGxBeDYLHoaDrT.jpg"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h1 className="hero_header">ROGUE ONE: A STAR WARS STORY</h1>
            <p className="hero_tagline">A REBELLION BUILT ON HOPE.</p>
            <div className="hero_genre-container">
              <p className="hero_genre">SCI-FI</p>
              <p className="hero_genre">ACTION</p>
              <p className="hero_genre">ADVENTURE</p>
            </div>
            <a
              className="hero_trailer"
              href="https://www.youtube.com/watch?v=frdj1zb9sMY"
            >
              <button type="button" className="btn btn-warning ">
                <WatchTrailerBtn />
                WATCH TRAILER
              </button>
            </a>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

      <Carousel.Item interval={5000}>
        <Link to={`/api/movies/movie/157336`} className="hero-movie-page">
          <img
            className="d-block w-100"
            src="https://www.themoviedb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h1 className="hero_header">INTERSTELLAR</h1>
            <p className="hero_tagline">
              MANKIND WAS BORN ON EARTH. IT WAS NEVER MEANT TO DIE HERE.
            </p>
            <div className="hero_genre-container">
              <p className="hero_genre">SCI-FI</p>
              <p className="hero_genre">DRAMA</p>
              <p className="hero_genre">ADVENTURE</p>
            </div>
            <a
              className="hero_trailer"
              href="https://www.youtube.com/watch?v=zSWdZVtXT7E"
            >
              <button type="button" className="btn btn-warning ">
                <WatchTrailerBtn />
                WATCH TRAILER
              </button>
            </a>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

      <Carousel.Item interval={5000}>
        <Link to={`/api/movies/movie/286217`} className="hero-movie-page">
          <img
            className="d-block w-100"
            src="https://www.themoviedb.org/t/p/original/lzMS0CI3FLQYC5EgJoWeIaEt0lm.jpg"
            alt="Fourth slide"
          />
          <Carousel.Caption>
            <h1 className="hero_header">THE MARTIAN</h1>
            <p className="hero_tagline">BRING HIM HOME.</p>
            <div className="hero_genre-container">
              <p className="hero_genre">SCI-FI</p>
              <p className="hero_genre">DRAMA</p>
              <p className="hero_genre">ADVENTURE</p>
            </div>
            <a
              className="hero_trailer"
              href="https://www.youtube.com/watch?v=ej3ioOneTy8"
            >
              <button type="button" className="btn btn-warning">
                <WatchTrailerBtn />
                WATCH TRAILER
              </button>
            </a>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>

      <Carousel.Item interval={5000}>
        <Link to={`/api/movies/movie/27205`} className="hero-movie-page">
          <img
            className="d-block w-100"
            src="https://www.themoviedb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"
            alt="Fifth slide"
          />
          <Carousel.Caption>
            <h1 className="hero_header">INCEPTION</h1>
            <p className="hero_tagline">YOUR MIND IS THE SCENE OF THE CRIME.</p>
            <div className="hero_genre-container">
              <p className="hero_genre">SCI-FI</p>
              <p className="hero_genre">ACTION</p>
              <p className="hero_genre">ADVENTURE</p>
            </div>
            <a
              className="hero_trailer"
              href="https://www.youtube.com/watch?v=YoHD9XEInc0"
            >
              <button type="button" className="btn btn-warning">
                <WatchTrailerBtn />
                WATCH TRAILER
              </button>
            </a>
          </Carousel.Caption>
        </Link>
      </Carousel.Item>
    </Carousel>
  );
}
