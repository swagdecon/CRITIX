import jwt_decode from "jwt-decode";
import CookieManager from "./CookieManager";
// import Logout from "./Logout";
let isRefreshingToken = false;

export default async function isExpired() {
  const token = CookieManager.decryptCookie("accessToken");
  const refreshToken = CookieManager.decryptCookie("refreshToken");

  if (token) {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime && !isRefreshingToken) {
      console.log("HELLO WORLD")
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
        console.log(data)
        CookieManager.encryptCookie("accessToken", data.access_token, {
          expires: 1,
        });
        CookieManager.encryptCookie("refreshToken", data.refresh_token, {
          expires: 7,
        });
      } catch (error) {
        console.log(error);
        // await Logout(navigate)

      } finally {
        isRefreshingToken = false;
      }
    }
  } else {
    return;
  }
}
