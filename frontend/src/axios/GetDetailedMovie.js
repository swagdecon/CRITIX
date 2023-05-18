import axios from "axios";

export default async function getDetailedMovie(endpoint, movieId) {
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
  const language = "en-US";
  const page = 1;
  let response;
  // This is checking if movieId is present, which we need for the recommended carousel for indMovie, as it takes the moveId of that movie to show appropriate recommendations
  if (movieId) {
    response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/${endpoint}?api_key=${API_KEY}&language=${language}&page=${page}&per_page=20&include_adult=false`
    );
  } else {
    // Otherwise it will show a list of movies, not taking in the moveId, such as for the list movie page where we want to return a colleciton of movies.
    response = await axios.get(
      `https://api.themoviedb.org/3/movie/${endpoint}?api_key=${API_KEY}&language=${language}&page=${page}&per_page=20&include_adult=false`
    );
  }

  const details = response.data.results.slice(0, 20);
  const detailedMovies = await Promise.all(
    details.map(async (movie) => {
      const detailsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=${language}`
      );
      const castResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`
      );
      const actors = castResponse.data.cast
        .slice(0, 5)
        .map((actor) => ({ id: actor.id, name: actor.name }));

      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&site="Youtube"`
      );
      const trailer = videoResponse.data.results.map((movie) => movie.key);

      return { ...movie, ...detailsResponse.data, actors, trailer };
    })
  );
  if (response.data.results.length === 0) {
    return null;
  }
  return detailedMovies;
}
