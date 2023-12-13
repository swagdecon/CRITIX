
import CookieManager from "./CookieManager";
import Cookies from "js-cookie";
import refreshJwtTokens from "./IsTokenExpired";
const LOGOUT_ENDPOINT = process.env.REACT_APP_LOGOUT_ENDPOINT;

export default async function Logout() {
    await refreshJwtTokens();
    try {
        let token = CookieManager.decryptCookie("accessToken");

        const response = await fetch(LOGOUT_ENDPOINT, {
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
