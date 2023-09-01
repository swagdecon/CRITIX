import { useEffect, useState } from "react";
import axios from "axios";
import isExpired from "./IsTokenExpired";
import { useNavigate } from "react-router-dom";
import CookieManager from "./CookieManager";
// import Logout from "./Logout";


export default function useFetchData(endpoint) {
  const [data, setData] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [prevEndpoint, setPrevEndpoint] = useState(null);
  const [retryCount, setRetryCount] = useState(0); // New state for retry count
  const navigate = useNavigate();

  const fetchData = async () => {
    await isExpired();
    let token = CookieManager.decryptCookie("accessToken");

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
      if (retryCount < 3) { // Retry only if retry count is less than 3
        setRetryCount(retryCount + 1); // Increment retry count
        fetchData(); // Retry the request
      } else {
        // Maximum retries reached, handle the error or call logout here
        // Example: await Logout(navigate);
      }
    }
  };

  const refetchData = () => {
    setRequestSent(false);
    setRetryCount(0); // Reset retry count when manually refetching
  };

  useEffect(() => {
    if (prevEndpoint !== endpoint) {
      setRequestSent(false);
      setDataLoaded(false);
      setPrevEndpoint(endpoint);
      setRetryCount(0); // Reset retry count when endpoint changes
    }
    if (!requestSent) {
      fetchData();
      setRequestSent(true);
    }
  }, [requestSent, endpoint, navigate, prevEndpoint]);

  return { data, dataLoaded, requestSent, refetchData };
}
