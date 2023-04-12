// import axios from "axios";
// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";

// export default async function fetchTmdbData() {
//   const [movie, setMovie] = useState({});
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   try {
//     const tokenWithFingerprint = sessionStorage.getItem("jwt");
//     const { token, fingerprint } = JSON.parse(tokenWithFingerprint);
//     const api_key = "d84f9365179dc98dc69ab22833381835";
//     const language = "en-US";
//     const response = await axios.get(
//       `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=${language}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Fingerprint": fingerprint,
//         },
//       }
//     );
//     setMovie(response.data);
//     setDataLoaded(true);
//   } catch (error) {
//     navigate("/403", { replace: true });
//     console.log(error);
//   }
// }
