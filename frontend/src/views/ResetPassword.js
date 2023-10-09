import React from "react"
import resetPwdStyles from "../misc/ResetPassword.module.css"
export default function ConfirmEmailForPwdReset() {
    return (
        <div className={resetPwdStyles["login-box"]}>
            <h2>Reset Password</h2>
            <form>
                <div className={resetPwdStyles["user-box"]}>
                    <input type="text" name="" required=""></input>
                    <label>Email Address</label>
                </div>
                <div className={resetPwdStyles["centered-button"]}>
                    <a href="#">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Submit
                    </a>
                </div>
            </form>
        </div>
    )
}