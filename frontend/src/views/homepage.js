import React from "react";
import "../components/MovieCard/moviecard.module.scss";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import NavBar from "../components/NavBar/NavBar.js";

export default function Homepage() {
  return (
    <div>
      <NavBar />
      <HeroCarousel />
      <MovieCarousel title="Popular right now" endpoint="/movies/popular" />
      <MovieCarousel title="Top Rated" endpoint="/movies/top_rated" />
      <MovieCarousel title="Releasing Soon" endpoint="/movies/upcoming" />
    </div>
  );
}
