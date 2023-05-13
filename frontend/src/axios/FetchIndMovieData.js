import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import isExpired from "../components/Other/IsTokenExpired.js";
export default function fetchIndMovieData(id) {
  const [movie, setMovie] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevId, setPrevId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        let token = Cookies.get("accessToken");

        const response = await axios.get(id, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMovie(await response.data);
        setDataLoaded(true);
      } catch (error) {
        await isExpired();
        try {
          // Token expired, get a new token and retry the request

          let newAccessToken = Cookies.get("accessToken");
          const response = await axios.get(id, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          setMovie(response.data);
          setDataLoaded(true);
        } catch (error) {
          navigate("/403", { replace: true });
          console.log(error);
        }
      }
    }
    if (prevId !== id) {
      // compare current url id with previous url id
      setRequestSent(false); // reset requestSent state variable
      setDataLoaded(false); // reset dataLoaded state variable
      setPrevId(id); // update previous id state variable
    }

    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, id, navigate, prevId]); // add prevId as a dependency

  return { movie, dataLoaded };
}
