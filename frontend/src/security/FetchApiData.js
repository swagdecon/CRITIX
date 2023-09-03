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
  const navigate = useNavigate();

  const fetchData = async () => {
    await isExpired(navigate);
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
      return
    }
  };

  const refetchData = () => {
    setRequestSent(false);
  };

  useEffect(() => {
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

  return { data, dataLoaded, requestSent, refetchData };
}
