import verificationStyles from "../misc/ResetPassword.module.css"
import LoginStyles from "../components/Login/login.module.css"
export default function SuccessEmailVerification() {

    return (
        <div className={verificationStyles.wrapper}>
            <div className={verificationStyles["login-box"]}>
                <h2>Reset Password</h2>
                {response && (
                    <div className={response.ok ? LoginStyles["success-msg"] : LoginStyles["error-msg"]}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}