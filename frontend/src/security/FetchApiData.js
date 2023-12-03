// FetchApiData.js
import axios from 'axios';
import CookieManager from './CookieManager';

export default async function fetchData(endpoint) {
  let token = CookieManager.decryptCookie('accessToken');
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}