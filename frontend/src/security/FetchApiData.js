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
      // try {
      let token = CookieManager.decryptCookie("accessToken");

      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setDataLoaded(true);
        setRequestSent(true);
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
          fetchData();
          console.log(error);
        }
      }
    }
    fetchData();
    if (prevEndpoint !== endpoint) {
      // compare current endpoint with previous endpoint
      setRequestSent(false); // reset requestSent state variable
      setDataLoaded(false); // reset dataLoaded state variable
      setPrevEndpoint(endpoint); // update previous endpoint state variable
    }

    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, endpoint, navigate, prevEndpoint]);

  return { data, dataLoaded, requestSent };
}
