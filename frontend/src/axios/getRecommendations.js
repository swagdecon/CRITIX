import axios from "axios";

const getRecommendations = async (movieId) => {
  const api_key = "d84f9365179dc98dc69ab22833381835";
  const language = "en-US";
  const page = 1;

  const response = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${api_key}&language=${language}&page=${page}&include_adult=false`
  );

  const recommendations = response.data.results;

  // Fetch details for each recommended movie
  const recommendedMovies = await Promise.all(
    recommendations.map(async (movie) => {
      const detailsResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${api_key}&language=${language}`
      );
      return { ...movie, details: detailsResponse.data };
    })
  );
  return recommendedMovies;
};

export default getRecommendations;
