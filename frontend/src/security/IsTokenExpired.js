import jwt_decode from "jwt-decode";
import CookieManager from "./CookieManager";

let refreshPromise = null;
export default function isTokenExpired() {
  return new Promise((resolve, reject) => {
    const token = CookieManager.decryptCookie("accessToken");
    const refreshToken = CookieManager.decryptCookie("refreshToken");

    const refreshTokenLogic = async () => {
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
        resolve(); // Resolve the promise when token is refreshed
      } catch (error) {
        reject(error); // Reject if there's an error during token refresh
      } finally {
        refreshPromise = null; // Reset the refreshPromise after completion
      }
    };

    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        if (!refreshPromise) {
          // If there's no ongoing refresh, create a new refreshPromise
          refreshPromise = refreshTokenLogic();
        }
        // Add resolve and reject to refreshPromise
        refreshPromise.then(resolve).catch(reject);
      } else {
        resolve(); // Resolve immediately if token is not expired
      }
    } else {
      reject("No token found"); // Reject if no token is found
    }
  });
}
