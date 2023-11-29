
import CookieManager from "./CookieManager";
import Cookies from "js-cookie";
import isExpired from "./IsTokenExpired";

export default async function Logout(navigate) {
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

            navigate("/login");
        }
    } catch (error) {
        // Token expired, get a new token and retry the request
        await isExpired();
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
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }
    }
}
