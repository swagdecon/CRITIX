import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import CookieManager from "./CookieManager";
let isRefreshingToken = false;

export default async function isExpired() {
  const token = CookieManager.decryptCookie("accessToken");
  const refreshToken = CookieManager.decryptCookie("refreshToken");

  if (token) {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime && !isRefreshingToken) {
      isRefreshingToken = true;
      try {
        const refreshResponse = await fetch(
          "http://localhost:8080/v1/auth/refresh-token",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const body = await refreshResponse.json();
        Cookies.set("accessToken", body.access_token, { expires: 0.5 });
        Cookies.set("refreshToken", body.refresh_token, { expires: 7 });
      } catch (error) {
        console.log(error);
      } finally {
        isRefreshingToken = false;
      }
    }
  } else {
    isRefreshingToken = true;
    try {
      const refreshResponse = await fetch(
        "http://localhost:8080/v1/auth/refresh-token",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      const body = await refreshResponse.json();
      Cookies.set("accessToken", body.access_token, { expires: 0.5 });
      Cookies.set("refreshToken", body.refresh_token, { expires: 7 });
    } catch (error) {
      console.log(error);
    } finally {
      isRefreshingToken = false;
    }
  }
}
