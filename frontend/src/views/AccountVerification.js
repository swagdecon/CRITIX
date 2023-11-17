import React from "react";
import verificationStyles from "../misc/ResetPassword.module.css";
// import LoginStyles from "../components/Login/login.module.css";

export default function AccountVerification() {
    // const [message, setMessage] = useState("");
    // const [isSuccess, setIsSuccess] = useState(false);

    return (
        <div className={verificationStyles.wrapper}>
            <div className={verificationStyles["login-box"]}>
                {/* {message && (
                    <div className={isSuccess ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                        {message}
                    </div>
                )} */}
                <h2>Account Verified</h2>
            </div>
        </div>
    );
}
