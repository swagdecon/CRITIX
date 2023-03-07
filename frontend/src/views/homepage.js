import React from "react";
import "../misc/moviecard.scss";
import "../misc/homepage.css";
import HeroCarousel from "../components/Carousel/HeroCarousel";
import MovieCarousel from "../components/Carousel/MovieCarousel";
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
      <body>
        <div>
          {/* NavBar */}
          {/* <Navbar /> */}
          <Container />
          {/* Hero Carousel */}
          <HeroCarousel />
          {/* Movie Cards Below */}
          <MovieCarousel
            title="Popular right now"
            endpoint="/api/movies/popular"
          />
          <MovieCarousel
            title="Now Playing"
            endpoint="/api/movies/now_playing"
          />
        </div>
      </body>
    </html>
  );
};

export default Homepage;
