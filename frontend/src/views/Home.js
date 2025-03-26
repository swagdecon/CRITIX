import React, { useState, useEffect } from "react";
import HeroCarousel from "../components/Carousel/HeroCarousel/HeroCarousel.js";
import MovieCarousel from "../components/Carousel/MovieCarousel/MovieCarousel.js";
import NavBar from "../components/NavBar/NavBar.js";
import LoadingPage from "./LoadingPage.js";
import HomePage from "../misc/HomePage.module.css";
import { fetchData } from "../security/Data.js";
import isTokenExpired from "../security/IsTokenExpired.js";
import { homepageBreakpoints } from "../components/Carousel/Other/General.js";
const popularMovieEndpoint = process.env.REACT_APP_POPULAR_MOVIES_ENDPOINT;
const topRatedMovieEndpoint = process.env.REACT_APP_TOP_RATED_MOVIES_ENDPOINT;
const upcomingMovieEndpoint = process.env.REACT_APP_UPCOMING_MOVIES_ENDPOINT;

function Homepage() {
  const [isLoading, setIsLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [moviesData, setMoviesData] = useState(null);

  useEffect(() => {
    window.addEventListener("resize", setWindowWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", setWindowWidth(window.innerWidth));
    };
  }, []);
  useEffect(() => {
    async function fetchBackendData() {
      try {
        await isTokenExpired();
        const [trendingMovies, topRatedMovies, upcomingMovies] = await Promise.all([
          fetchData(popularMovieEndpoint),
          fetchData(topRatedMovieEndpoint),
          fetchData(upcomingMovieEndpoint),
        ]);
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
      {!(windowWidth < 900) ? <HeroCarousel /> : null}
      <div className={HomePage.movie_carousel_wrapper}>
        <MovieCarousel
          title="Trending movies"
          movies={moviesData.trendingMovies}
          endpoint={popularMovieEndpoint}
          breakpoints={homepageBreakpoints()}
        />

        <MovieCarousel
          title="Top Rated"
          movies={moviesData.topRatedMovies}
          endpoint={topRatedMovieEndpoint}
          breakpoints={homepageBreakpoints()}
        />
        <MovieCarousel
          title="Releasing Soon"
          movies={moviesData.upcomingMovies}
          endpoint={upcomingMovieEndpoint}
          breakpoints={homepageBreakpoints()}
        />
      </div>
    </div>
  );
}

export default Homepage;
