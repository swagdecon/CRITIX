import React, { useState, useEffect } from "react";
import verificationStyles from "../misc/ResetPassword.module.css";
import LoginStyles from "../components/Login/login.module.css";
const ACTIVATE_ACCOUNT_ENDPOINT = process.env.REACT_APP_ACTIVATE_ACCOUNT_ENDPOINT;

export default function AccountVerification() {
    const [message, setMessage] = useState(null);
    const [endpointResponse, setEndpointResponse] = useState(null);
    const [showButton, setShowButton] = useState(true);
    const [countDown, setCountDown] = useState(5);
    const [countdownInterval, setCountdownInterval] = useState(null);

    const currentURL = window.location.href;
    const tokenStartIndex = currentURL.indexOf("/activate-account/") + "/activate-account/".length;
    const encrypedEmail = currentURL.substring(tokenStartIndex, tokenStartIndex + 87);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(ACTIVATE_ACCOUNT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: encrypedEmail
            });
            const responseText = await response.text()
            startCountdown();
            if (response.ok) {
                setMessage(responseText);
                setEndpointResponse(response);
                setShowButton(false)
            } else {
                setEndpointResponse(response);
                setMessage(responseText);
                setShowButton(false)
            }
        } catch (error) {
            setMessage(` ${error.message}`);
        }
    };

    return (
        <div className={verificationStyles.wrapper}>
            <div className={verificationStyles["login-box"]}>
                <h2>Verify your email</h2>
                {endpointResponse && (
                    <div className={endpointResponse.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className={verificationStyles["user-box"]}>
                        {showButton ?
                            <div className={verificationStyles["centered-button"]}>
                                <button>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    Submit
                                </button>
                            </div>
                            : <span className={verificationStyles["redirect-txt"]}>{`You will be redirected to login in ${countDown} seconds`}</span>}
                    </div>
                </form>
            </div>
        </div>
    );
}


