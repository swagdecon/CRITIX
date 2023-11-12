import React, { useState } from "react"
import resetPwdStyles from "../misc/ResetPassword.module.css"
import LoginStyles from "../components/Login/login.module.css"

export default function ConfirmEmailForPwdReset() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [response, setResponse] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8080/v1/auth/send-password-recovery-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: email
            });
            if (response.ok) {
                setMessage("If there's an associated account, we've sent a password reset link.");
                setEmail("");
                setResponse(response);
            } else {
                const errorMessage = await response.text();
                setResponse(response);
                setMessage(`${errorMessage}`);
            }
        } catch (error) {
            setMessage(` ${error.message}`);
        }
    };

    return (
        <div className={resetPwdStyles["login-box"]}>
            <h2>Reset Password</h2>
            {response && (
                <div className={response.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                    {message}
                </div>
            )}
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
        </div>
    );
}