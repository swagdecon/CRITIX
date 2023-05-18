import axios from "axios";

export default async function getDetailedMovie(endpoint, movieId) {
  const api_key = "d84f9365179dc98dc69ab22833381835";
  const language = "en-US";
  const page = 1;

  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/${endpoint}?api_key=${api_key}&language=${language}&page=${page}&per_page=20&include_adult=false`
  );
  const details = response.data.results.slice(0, 20);
  const detailedMovies = await Promise.all(
    details.map(async (movie) => {
      const detailsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}&language=${language}`
      );
      const castResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${api_key}`
      );
      const actors = castResponse.data.cast
        .slice(0, 5)
        .map((actor) => ({ id: actor.id, name: actor.name }));

      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${api_key}&site="Youtube"`
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
