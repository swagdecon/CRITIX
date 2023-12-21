// FetchApiData.js
import axios from 'axios';
import CookieManager from './CookieManager';

export async function fetchData(endpoint, options) {
  let token = CookieManager.decryptCookie('accessToken');
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        options: options
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function sendData(endpoint, options) {
  const token = CookieManager.decryptCookie('accessToken');
  try {
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          ContentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          options: options,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}