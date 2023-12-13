import React, { useState, useEffect } from "react";
import verificationStyles from "../misc/ResetPassword.module.css";
import LoginStyles from "../components/Login/login.module.css";

export default function AccountVerification() {
    const [message, setMessage] = useState(null);
    const [response, setResponse] = useState(null)
    const [showButton, setShowButton] = useState(true);
    const [countDown, setCountDown] = useState(5);
    const [countdownInterval, setCountdownInterval] = useState(null);

    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const encrypedEmail = url.pathname.split('/').pop();

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
            // Clear the countdown interval when the component unmounts
            clearInterval(countdownInterval);
        };
    }, [countdownInterval]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/v1/auth/activate-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: encrypedEmail
            });
            const responseText = await response.text()
            startCountdown();
            if (response.ok) {
                setMessage(responseText);
                setResponse(response);
                setShowButton(false)
            } else {
                setResponse(response);
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
                {response && (
                    <div className={response.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
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


