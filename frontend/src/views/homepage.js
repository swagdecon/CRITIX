import React, { useState, useEffect } from "react";
import "../misc/moviecard.scss";
import "../misc/homepage.css";
import HeroCarousel from "../components/HeroCarousel";
import MovieCarousel from "../components/MovieCarousel";
// import Navbar from "../components/NavBar/Navbar";
// import Header from "../components/Header/Header";
import Container from "../components/Container/Container";

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const tokenWithFingerprint = sessionStorage.getItem("jwt");
        const { token, fingerprint } = JSON.parse(tokenWithFingerprint);

        const myResponse = await fetch("/api/movies/popular", {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Fingerprint": fingerprint,
          },
        });

        if (myResponse.ok) {
          const responseJson = await myResponse.json();
          setMovies(responseJson);
        } else {
          console.log(`HTTP error! status: ${myResponse.status}`);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
  }, []);

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
          <MovieCarousel movies={movies} />
        </div>
      </body>
    </html>
  );
};

export default Homepage;
