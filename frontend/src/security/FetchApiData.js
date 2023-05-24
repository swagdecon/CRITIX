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
  // This useEffect hook is used to handle data fetching
  useEffect(() => {
    async function fetchData() {
      let token = CookieManager.decryptCookie("accessToken");
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      // Check if token is still valid based on the expiration date
      if (decodedToken.exp > currentTime) {
        try {
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          // Update state with fetched data
          setData(response.data);
          setDataLoaded(true);
          setRequestSent(true);
        } catch (error) {
          console.log(error);
        }
      } else {
        // If token is expired, refresh it and fetch data again
        await isExpired();
        try {
          const response = await axios.get(endpoint, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          // Update state with fetched data
          setData(response.data);
          setDataLoaded(true);
          setRequestSent(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
    // Check if endpoint has changed, if so reset dataLoaded and requestSent state
    if (prevEndpoint !== endpoint) {
      setRequestSent(false);
      setDataLoaded(false);
      setPrevEndpoint(endpoint);
    }
    // Check if request has been sent, if not fetch data and set requestSent to true
    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, endpoint, navigate, prevEndpoint]);
  // Return fetched data and state of dataLoaded and requestSent
  return { data, dataLoaded, requestSent };
}