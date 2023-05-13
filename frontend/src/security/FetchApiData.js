import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import isExpired from "./IsTokenExpired";
import { useNavigate } from "react-router-dom";

export default function useFetchData(endpoint) {
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevEndpoint, setPrevEndpoint] = useState(null);
  const navigate = useNavigate();

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
        setData(await response.data);
        setDataLoaded(true);
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
          setData(response.data);
          setDataLoaded(true);
        } catch (error) {
          console.log(error);
        }
      }
    }
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

  return { data, dataLoaded };
}
