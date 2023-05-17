import React from "react";

import LoadingPage from "./LoadingPage";
import MovieCard from "../components/MovieCard/MovieCard";
import useFetchData from "../security/FetchApiData";
export default function MovieList(endpoint) {
  const { data: movies, dataLoaded: dataLoaded } = useFetchData(endpoint);

  if (!dataLoaded) {
    return <LoadingPage />;
  }
  console.log(movies);
  return (
    <html>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>
        <li>
          {movies.map((movie, i) => (
            <div key={i}>
              <MovieCard
                poster={movie.posterPath}
                rating={movie.voteAverage}
                runtime={movie.runtime}
                genres={movie.genres}
                overview={movie.overview}
                actors={movie.actors}
                video={movie.video}
              />
            </div>
          ))}
        </li>
      </body>
    </html>
  );
}
