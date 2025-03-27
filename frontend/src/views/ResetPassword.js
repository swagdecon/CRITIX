import React, { useState, useEffect } from "react"
import resetPwdStyles from "../misc/ResetDetails.module.css"
import LoginStyles from "../components/Login/login.module.css"
const RESET_PWD_ENDPOINT = process.env.REACT_APP_RESET_PWD_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [endpointResponse, setEndpointResponse] = useState(null)
    const [showButton, setShowButton] = useState(true);
    const [countDown, setCountDown] = useState(5);
    const [countdownInterval, setCountdownInterval] = useState(null);
    const handlePassword = (e) => setPassword(e.target.value)
    const handleConfirmPassword = (e) => setConfirmPassword(e.target.value)

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

        if (password !== confirmPassword) {
            setMessage("Error: Passwords don't match");
        } else if (password.length < 7 || confirmPassword.length < 7 || !/[a-zA-Z0-9]/.test(password) || !/[a-zA-Z0-9]/.test(confirmPassword)) {
            setMessage("Error: Your password must be a mix of letters and numbers, and at least 7 characters")
        } else {
            const currentURL = window.location.href;
            const tokenStartIndex = currentURL.indexOf("/reset-password/") + "/reset-password/".length;
            const token = currentURL.substring(tokenStartIndex, tokenStartIndex + 87);
            try {
                const response = await fetch(`${API_URL}${RESET_PWD_ENDPOINT}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        emaiL: token,
                        password: password
                    })
                });
                const responseText = await response.text()
                startCountdown();
                if (response.ok) {
                    setMessage(responseText);
                    setPassword("");
                    setConfirmPassword("");
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
        <div className={resetPwdStyles.wrapper}>
            <div className={resetPwdStyles["login-box"]}>
                <h2>Reset Password</h2>
                {endpointResponse && (
                    <div className={endpointResponse.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                        {message}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className={resetPwdStyles["user-box"]}>
                        <input
                            type="password"
                            name="password"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                            required
                            value={password}
                            autoComplete="off"
                            placeholder=""
                            onChange={handlePassword} />
                        <label>New Password</label>
                    </div>
                    <div className={resetPwdStyles["user-box"]}>
                        <input
                            type="password"
                            name="confirmPassword"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                            required
                            value={confirmPassword}
                            autoComplete="off"
                            placeholder=""
                            onChange={handleConfirmPassword} />
                        <label>Confirm Password</label>
                        <div />
                    </div>
                    {showButton ?
                        <div className={resetPwdStyles["centered-button"]}>
                            <button>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Submit
                            </button>
                        </div>
                        : <span className={resetPwdStyles["redirect-txt"]}>{`You will be redirected to login in ${countDown} seconds`}</span>}
                </form>
            </div >
        </div>
    );
}