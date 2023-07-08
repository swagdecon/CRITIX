import React, { useState } from "react";
import "../components/MovieCard/moviecard.module.scss";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import NavBar from "../components/NavBar/NavBar.js";
import LoadingPage from "./LoadingPage";
import HomePage from "../misc/HomePage.module.css";

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
      <div className={HomePage.movie_carousel_wrapper}>
        <div className={HomePage.movie_carousel_container}>
          <MovieCarousel
            title="Popular right now"
            endpoint="/movies/popular"
            onLoad={handleLoad}
          />
        </div>
        <div className={HomePage.movie_carousel_container}>
          <MovieCarousel
            title="Top Rated"
            endpoint="/movies/top_rated"
            onLoad={handleLoad}
          />
        </div>
        <div className={HomePage.movie_carousel_container}>
          <MovieCarousel
            title="Releasing Soon"
            endpoint="/movies/upcoming"
            onLoad={handleLoad}
          />
        </div>
      </div>
    </div>
  );
}