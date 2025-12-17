import React, { useState, useCallback } from "react"
import resetPwdStyles from "../misc/ResetDetails.module.css"
import LoginStyles from "../components/Login/login.module.css"
const SEND_RESET_PWD_ENDPOINT = process.env.REACT_APP_SEND_PWD_RESET_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function ConfirmEmailForPwdReset() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [endpointResponse, setEndpointResponse] = useState(null)
    const [showInputFields, setShowInputFields] = useState(true);
    const handleClick = useCallback((e) => setEmail(e.target.value))

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}${SEND_RESET_PWD_ENDPOINT}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: email
            });
            const responseText = await response.text()
            if (response.ok) {
                setMessage(responseText);
                setEmail("");
                setEndpointResponse(response);
                setShowInputFields(false)
            } else {
                setEndpointResponse(response);
                setMessage(responseText);
                setShowInputFields(false)
            }
        } catch (error) {
            setMessage(` ${error.message}`);
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
                {showInputFields ?
                    <form onSubmit={handleSubmit}>
                        <div className={resetPwdStyles["user-box"]}>
                            <input
                                type="email"
                                name="email"
                                required
                                autoComplete="off"
                                onChange={handleClick}
                                value={email}
                                placeholder=""
                            />
                            <label>Email Address</label>
                        </div>
                        <div className={resetPwdStyles["centered-button"]}>
                            <button>
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Submit
                            </button>
                        </div>
                    </form>
                    : null}
            </div>
        </div>
    );
}