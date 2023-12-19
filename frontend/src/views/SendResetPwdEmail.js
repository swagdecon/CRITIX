import React, { useState } from "react"
import resetPwdStyles from "../misc/ResetPassword.module.css"
import LoginStyles from "../components/Login/login.module.css"
const SEND_RESET_PWD_ENDPOINT = process.env.REACT_APP_RESET_PWD_ENDPOINT;

export default function ConfirmEmailForPwdReset() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [response, setResponse] = useState(null)
    const [showInputFields, setShowInputFields] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(SEND_RESET_PWD_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: email
            });
            const responseText = await response.text()
            if (response.ok) {
                setMessage(responseText);
                setEmail("");
                setResponse(response);
                setShowInputFields(false)
            } else {
                setResponse(response);
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
                {response && (
                    <div className={response.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
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
                                onChange={(e) => setEmail(e.target.value)}
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