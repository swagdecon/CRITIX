import React, { useState, useEffect } from "react"
import resetEmailStyles from "../misc/ResetDetails.module.css"
import LoginStyles from "../components/Login/login.module.css"
const RESET_EMAIL_ENDPOINT = process.env.REACT_APP_AUTHENTICATE_NEW_EMAIL;

export default function ResetPassword() {
    const [newEmail, setNewEmail] = useState("");
    const [confirmNewEmail, setConfirmNewEmail] = useState("");
    const [message, setMessage] = useState("");
    const [endpointResponse, setEndpointResponse] = useState(null)
    const [showButton, setShowButton] = useState(true);
    const [countDown, setCountDown] = useState(5);
    const [countdownInterval, setCountdownInterval] = useState(null);
    const handleEmail = (e) => setNewEmail(e.target.value)
    const handleConfirmEmail = (e) => setConfirmNewEmail(e.target.value)

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
        if (newEmail !== confirmNewEmail) {
            setMessage("Error: Email's don't match");
        } else {
            const currentURL = window.location.href;
            const tokenStartIndex = currentURL.indexOf("/reset-email/") + "/reset-email/".length;
            const currentEmailToken = currentURL.substring(tokenStartIndex, tokenStartIndex + 87);

            try {
                const response = await fetch(RESET_EMAIL_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        currentEmail: currentEmailToken,
                        newEmail: newEmail,
                    })
                });
                const responseText = await response.text()
                startCountdown();
                if (response.ok) {
                    setMessage(responseText);
                    setNewEmail("");
                    setConfirmNewEmail("");
                    setEndpointResponse(response);
                    setShowButton(false)
                } else {
                    setEndpointResponse(response);
                    setMessage(responseText);
                    setShowButton(false)
                }
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className={resetEmailStyles.wrapper}>
            <div className={resetEmailStyles["login-box"]}>
                <h2>Reset Email</h2>
                {message && (
                    <div className={endpointResponse && endpointResponse.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className={resetEmailStyles["user-box"]}>
                        <input
                            type="email"
                            name="email"
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            required
                            value={newEmail}
                            autoComplete="off"
                            placeholder=""
                            onChange={handleEmail} />
                        <label>New Email</label>
                    </div>
                    <div className={resetEmailStyles["user-box"]}>
                        <input
                            type="email"
                            name="confirmEmail"
                            pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                            required
                            value={confirmNewEmail}
                            autoComplete="off"
                            placeholder=""
                            onChange={handleConfirmEmail} />
                        <label>Confirm New Email</label>
                        <div />
                    </div>
                    {showButton ?
                        <div className={resetEmailStyles["centered-button"]}>
                            <button>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Submit
                            </button>
                        </div>
                        : <span className={resetEmailStyles["redirect-txt"]}>{`You will be redirected to login in ${countDown} seconds`}</span>}
                </form>
            </div >
        </div>
    );
}