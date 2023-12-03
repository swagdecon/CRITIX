import axios from "axios";

export default async function getDetailedMovie(endpoint, options) {
  const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

  const language = options && options.language ? options.language : "en-US";
  const page = options && options.page ? options.page : 1;
  const params = new URLSearchParams({
    api_key: API_KEY,
    language,
    page,
    per_page: 20,
    include_adult: false,
    ...options
  });
  // if the movie id is provided, we will use it to get the details, with an endpoint, as well as any optional parameters, otherwise we will just use the endpoint to get a list
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${endpoint}?${params.toString()}`);
  if (response.data.results.length === 0) {
    return null;
  }
  const details = response.data.results.slice(0, 20).map(async (movie) => {
    // This is a bit of a hack to get around the fact that the API doesn't get all the informaiton we need for the movieCard, so we have to get it from other endpoints
    const [detailsResponse] = await Promise.allSettled([
      axios.get(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}&language=${language}`),
    ]);
    if (detailsResponse.status === "rejected") {
      return null;
    }
    const KernelRating = Math.round(detailsResponse.value.data.vote_average * 10);

    // gets the trailer url from the API
    return { ...movie, ...detailsResponse.value.data, vote_average: KernelRating };
  });

  // This code uses a Promise to retrieve detailed information about movies asynchronously and then filters out any rejected Promises. Finally, it maps over the fulfilled Promises to return an array of details for all the movies specified in the  details  array.
  const detailedMovies = await Promise.allSettled(details).then((results) => results.filter((result) => result.status === "fulfilled").map((result) => result.value));
  return { totalPages: response.data.total_pages, detailedMovies };
}