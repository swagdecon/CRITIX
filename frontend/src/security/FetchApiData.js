import { useEffect, useState } from "react";
import axios from "axios";
import isExpired from "./IsTokenExpired";
import { useNavigate } from "react-router-dom";
import CookieManager from "./CookieManager";
import jwt_decode from "jwt-decode";

export default function useFetchData(endpoint) {
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevEndpoint, setPrevEndpoint] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      let token = CookieManager.decryptCookie("accessToken");
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp > currentTime) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          setData(response.data);
          setDataLoaded(true);
          setRequestSent(true);
        } catch (error) {
          console.log(error);
        }
      } else {
        await isExpired();

        try {
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          setData(response.data);
          setDataLoaded(true);
          setRequestSent(true);
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (prevEndpoint !== endpoint) {
      setRequestSent(false);
      setDataLoaded(false);
      setPrevEndpoint(endpoint);
    }

    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, endpoint, navigate, prevEndpoint]);

  return { data, dataLoaded, requestSent };
}
