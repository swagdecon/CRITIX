import React from "react";
import "../misc/moviecard.module.scss";
// import HomeStyle from "../misc/homepage.css";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel.js";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
// import LoadingPage from "./LoadingPage";
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
      <isLoading />

      <body>
        <Container />
        <HeroCarousel />
        <MovieCarousel title="Popular right now" endpoint="/movies/popular" />
        <MovieCarousel title="Top Rated" endpoint="/movies/top_rated" />
        <MovieCarousel title="Releasing Soon" endpoint="/movies/upcoming" />
      </body>
    </html>
  );
}
