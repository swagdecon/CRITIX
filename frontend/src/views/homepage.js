import React from "react";
import "../misc/moviecard.scss";
import "../misc/homepage.css";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel.js";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
// import Navbar from "../components/NavBar/Navbar";
// import Header from "../components/Header/Header";
import Container from "../components/Container/Container";

const Homepage = () => {
  return (
    <html>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />

      <body style={{ marginTop: 80 }}>
        <div>
          <Container />
          <HeroCarousel />
          <MovieCarousel
            title="Popular right now"
            endpoint="/api/movies/popular"
          />
          <MovieCarousel title="Top Rated" endpoint="/api/movies/top_rated" />
          <MovieCarousel
            title="Releasing Soon"
            endpoint="/api/movies/upcoming"
          />
        </div>
      </body>
    </html>
  );
};

export default Homepage;
