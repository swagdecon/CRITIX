import axios from "axios";

export default async function getRecommendations(movieId) {
  const api_key = "d84f9365179dc98dc69ab22833381835";
  const language = "en-US";
  const page = 1;

  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&language=${language}&page=${page}&per_page=20&include_adult=false`
  );

  const recommendations = response.data.results.slice(0, 20);
  // Fetch details for each recommended movie
  const recommendedMovies = await Promise.all(
    recommendations.map(async (movie) => {
      const detailsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}&language=${language}`
      );
      return { ...movie, details: detailsResponse.data };
    })
  );
  console.log(recommendedMovies);
  return recommendedMovies;
}
