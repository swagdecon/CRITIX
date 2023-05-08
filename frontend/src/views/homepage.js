import React from "react";
import "../misc/moviecard.module.scss";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel.js";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import Container from "../components/Container/Container";

export default function Homepage() {
  return (
    <div>
      <Container />
      <HeroCarousel />
      <MovieCarousel title="Popular right now" endpoint="/movies/popular" />
      <MovieCarousel title="Top Rated" endpoint="/movies/top_rated" />
      <MovieCarousel title="Releasing Soon" endpoint="/movies/upcoming" />
    </div>
  );
}
