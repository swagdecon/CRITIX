import axios from "axios";

export default async function getSearch(input) {
  const api_key = "d84f9365179dc98dc69ab22833381835";
  const language = "en-US";
  const page = 1;

  const response = await axios.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${input}&language=${language}&page=${page}&include_adult=${false}`
  );
  return response;
}
