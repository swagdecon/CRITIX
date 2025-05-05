// FetchApiData.js
import axios from 'axios';
import CookieManager from './CookieManager';

export async function fetchData(endpoint, data) {
  let token = CookieManager.decryptCookie('accessToken');
  try {
    const response = await axios.get(endpoint, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function sendData(endpoint, data) {
  let token = CookieManager.decryptCookie('accessToken');
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    console.log(response)
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}