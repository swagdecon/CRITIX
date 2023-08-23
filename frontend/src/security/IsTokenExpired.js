import jwt_decode from "jwt-decode";
import CookieManager from "./CookieManager";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
let isRefreshingToken = false;

export default async function isExpired() {
  const navigate = useNavigate();
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
        const data = await refreshResponse.json();
        CookieManager.encryptCookie("accessToken", data.access_token, {
          expires: 1,
        });
        CookieManager.encryptCookie("refreshToken", data.refresh_token, {
          expires: 7,
        });
      } catch (error) {
        console.log(error);
        await Logout(navigate)

      } finally {
        isRefreshingToken = false;
      }
    }
  } else {
    return;
  }
}
