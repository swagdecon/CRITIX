import React, { useState, useCallback, useEffect } from "react";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel.js";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import NavBar from "../components/NavBar/NavBar.js";
import LoadingPage from "./LoadingPage.js";
import HomePage from "../misc/HomePage.module.css";
import fetchData from "../security/FetchApiData.js";
import isTokenExpired from "../security/IsTokenExpired.js";
function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [moviesData, setMoviesData] = useState(null);
  const popularMovieEndpoint = "/movies/popular"
  const topRatedMovieEndpoint = "/movies/top_rated"
  const upcomingMovieEndpoint = "/movies/upcoming"
  const handleLoad = useCallback(() => {
    setIsLoading(false);
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

  useEffect(() => {
    async function fetchBackendData() {
      setIsLoading(true);
      try {
        await isTokenExpired();
        const trendingMovies = await fetchData(popularMovieEndpoint);
        const topRatedMovies = await fetchData(topRatedMovieEndpoint);
        const upcomingMovies = await fetchData(upcomingMovieEndpoint);

        setMoviesData({
          trendingMovies,
          topRatedMovies,
          upcomingMovies,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBackendData();
  }, []);

  return isLoading || !moviesData ? (
    <LoadingPage />
  ) : (
    <div>
      <NavBar />
      {!(windowWidth < 900) ? <HeroCarousel onLoad={handleLoad} /> : null}
      <div className={HomePage.movie_carousel_wrapper}>
        <MovieCarousel
          title="Trending movies"
          movies={moviesData.trendingMovies}
          endpoint={popularMovieEndpoint}
          onLoad={handleLoad}
        />
        <MovieCarousel
          title="Top Rated"
          movies={moviesData.topRatedMovies}
          endpoint={topRatedMovieEndpoint}
          onLoad={handleLoad}
        />
        <MovieCarousel
          title="Releasing Soon"
          movies={moviesData.upcomingMovies}
          endpoint={upcomingMovieEndpoint}
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}

export default Homepage;
