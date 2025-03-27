
import CookieManager from "./CookieManager";
import Cookies from "js-cookie";
import refreshJwtTokens from "./IsTokenExpired";
const LOGOUT_ENDPOINT = process.env.REACT_APP_LOGOUT_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default async function Logout() {
    await refreshJwtTokens();
    try {
        let token = CookieManager.decryptCookie("accessToken");

        const response = await fetch(`${API_URL}${LOGOUT_ENDPOINT}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            window.location.href = "/login"
        }
    } catch (error) {
        console.error(error)
    }
}
