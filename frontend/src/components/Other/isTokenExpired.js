import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
export default async function isExpired() {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken");
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000; // Convert to seconds

  if (decodedToken.exp < currentTime) {
    // Token is expired, make a call to the refresh token endpoint
    const refreshToken = Cookies.get("refreshToken");
    const refreshResponse = await fetch(
      "http://localhost:8080/v1/auth/refresh-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
    const newAccessToken = refreshResponse.data.access_token;
    Cookies.set("accessToken", newAccessToken, { expires: 1 });
    const newDecodedToken = jwt_decode(newAccessToken);
    if (newDecodedToken.exp < currentTime) {
      navigate("/login");
    }
    return newAccessToken;
  }
}
