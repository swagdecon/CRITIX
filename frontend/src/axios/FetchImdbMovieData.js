import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import isExpired from "../components/Other/IsTokenExpired";
export default function fetchData(endpoint) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let token = Cookies.get("accessToken");

        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(await response.data);
      } catch (error) {
        // Token expired, get a new token and retry the request
        await isExpired();
        try {
          let newAccessToken = Cookies.get("accessToken");
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          setMovies(await response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
    fetchData();
  }, [endpoint]);

  return movies;
}
