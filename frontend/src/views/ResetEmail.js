import React, { useState, useEffect } from "react"
import resetPwdStyles from "../misc/ResetPassword.module.css"
import LoginStyles from "../components/Login/login.module.css"
const AUTH_EMAIL_ENDPOINT = process.env.REACT_APP_AUTHENTICATE_NEW_EMAIL;

export default function ResetPassword() {
    const [message, setMessage] = useState("");
    const [endpointResponse, setEndpointResponse] = useState("Attempting to authenticate new email")
    const [countDown, setCountDown] = useState(5);
    const [countdownInterval, setCountdownInterval] = useState(null);

    const startCountdown = () => {
        const interval = setInterval(() => {
            setCountDown(prevCountDown => prevCountDown - 1);
        }, 1000);

        setCountdownInterval(interval);

        setTimeout(() => {
            clearInterval(interval);
            window.location.href = "/login";
        }, countDown * 1000);
    };

    useEffect(() => {
        return () => {
            clearInterval(countdownInterval);
        };
    }, [countdownInterval]);

    const onLoad = async (e) => {
        e.preventDefault();

        const currentURL = window.location.href;
        const tokenStartIndex = currentURL.indexOf("/reset-email/") + "/reset-email/".length;
        const token = currentURL.substring(tokenStartIndex, tokenStartIndex + 87);
        try {
            const response = await fetch(`${AUTH_EMAIL_ENDPOINT}${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emaiL: token,
                })
            });
            const responseText = await response.text()
            startCountdown();
            if (response.ok) {
                setMessage(responseText);
                setEndpointResponse(response);
            } else {
                setEndpointResponse(response);
                setMessage(responseText);

            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    }
    window.onload(onLoad)
    return (
        <div className={resetPwdStyles.wrapper}>
            <div className={resetPwdStyles["login-box"]}>
                <h2>Reset Email</h2>
                {endpointResponse.ok && (
                    <div className={endpointResponse.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                        {message}
                    </div>
                )}
                <form>
                    {endpointResponse.ok ?
                        <span className={resetPwdStyles["redirect-txt"]}>{`You will be redirected to login in ${countDown} seconds`}</span> : null}
                </form>
            </div >
        </div>
    )
}