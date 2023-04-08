import React from "react";
import "../misc/moviecard.module.scss";
import "../misc/homepage.css";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel.js";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
// import Navbar from "../components/NavBar/Navbar";
// import Header from "../components/Header/Header";
import Container from "../components/Container/Container";

export default function Homepage() {
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>

      <body>
        <Container />
        <HeroCarousel />
        <MovieCarousel
          title="Popular right now"
          endpoint="/api/movies/popular"
        />
        <MovieCarousel title="Top Rated" endpoint="/api/movies/top_rated" />
        <MovieCarousel title="Releasing Soon" endpoint="/api/movies/upcoming" />
      </body>
    </html>
  );
}
