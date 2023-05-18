import React, { useState } from "react";
import "../components/MovieCard/moviecard.module.scss";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import NavBar from "../components/NavBar/NavBar.js";
import LoadingPage from "./LoadingPage";
export default function Homepage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoad = () => {
    setIsLoading(true);
  };
  return isLoading ? (
    <LoadingPage />
  ) : (
    <div>
      <NavBar />
      <HeroCarousel onLoad={handleLoad} />
      <MovieCarousel
        title="Popular right now"
        endpoint="/movies/popular"
        onLoad={handleLoad}
      />
      <MovieCarousel
        title="Top Rated"
        endpoint="/movies/top_rated"
        onLoad={handleLoad}
      />
      <MovieCarousel
        title="Releasing Soon"
        endpoint="/movies/upcoming"
        onLoad={handleLoad}
      />
    </div>
  );
}
