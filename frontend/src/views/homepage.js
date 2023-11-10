import React, { useState, useCallback, useEffect } from "react";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import NavBar from "../components/NavBar/NavBar.js";
import LoadingPage from "./LoadingPage";
import HomePage from "../misc/HomePage.module.css";

function Homepage() {
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleLoad = useCallback(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div>
      <NavBar />
      {!(windowWidth < 900) ?
        <HeroCarousel onLoad={handleLoad} />
        : null}
      <div className={HomePage.movie_carousel_wrapper}>
        <MovieCarousel
          title="Trending movies"
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
    </div>
  );
}

export default React.memo(Homepage);
