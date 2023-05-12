import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

let isRefreshingToken = false;

export default async function isExpired() {
  console.log(isRefreshingToken);
  const token = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");
  console.log("Access Token in isExpired pre request", token);
  console.log("Access Token in isExpired pre request", refreshToken);

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
      console.log(body);
      Cookies.set("accessToken", body.access_token, { expires: 0.5 });
      Cookies.set("refreshToken", body.refresh_token, { expires: 7 });
    } catch (error) {
      console.log(error);
    } finally {
      isRefreshingToken = false;
    }
  }
}
