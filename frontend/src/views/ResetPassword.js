import React, { useState } from "react"
import resetPwdStyles from "../misc/ResetPassword.module.css"
import LoginStyles from "../components/Login/login.module.css"
export default function ConfirmEmailForPwdReset() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/v1/auth/password/password-recovery-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("If there's an associated account, we've sent a password reset link.");
                setEmail("");
            } else {
                const errorMessage = await response.text();
                setMessage(`Error: ${errorMessage}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className={resetPwdStyles["login-box"]}>
            <h2>Reset Password</h2>
            {message && (
                <div className={message.includes("Error") ? LoginStyles["error-msg"] : LoginStyles["success-msg"]}>
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className={resetPwdStyles["user-box"]}>
                    <input
                        type="email"
                        name="email"
                        required
                        value={email}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
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