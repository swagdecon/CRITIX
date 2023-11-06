import React, { useState } from "react"
import resetPwdStyles from "../misc/ResetPassword.module.css"
import LoginStyles from "../components/Login/login.module.css"
export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage(`Error: Passwords don't match`);
        } else if (password.length < 7 || confirmPassword.length < 7 || !/[a-zA-Z0-9]/.test(password) || !/[a-zA-Z0-9]/.test(confirmPassword)) {
            setMessage(`Error: Your password must be a mix of letters and numbers, and at least 7 characters`)
        } else {
            try {
                const response = await fetch("http://localhost:8080/v1/auth/password/reset-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: password,
                });

                if (response.ok) {
                    setMessage("Your Password has been reset");
                    setPassword("");
                    setConfirmPassword();
                } else {
                    const errorMessage = await response.text();
                    setMessage(`Error: ${errorMessage}`);
                }
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        }
    }

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
                        type="password"
                        name="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                        required
                        value={password}
                        autoComplete="off"
                        placeholder=""
                        onChange={(e) => setPassword(e.target.value)} />
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
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                    <label>Confirm Password</label>
                    <div />
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
        </div >
    );
}