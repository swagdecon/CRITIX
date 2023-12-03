
import CookieManager from "./CookieManager";
import Cookies from "js-cookie";
import refreshJwtTokens from "./IsTokenExpired";
import { Navigate } from "react-router-dom";
export default async function Logout() {
    await refreshJwtTokens();

    try {
        let token = CookieManager.decryptCookie("accessToken");

        const response = await fetch("http://localhost:8080/v1/auth/logout", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.ok) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            Navigate("/login")
        }
    } catch (error) {
        console.error(error)
    }
}
