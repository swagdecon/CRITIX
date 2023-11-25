import React from "react";
// Functions Shared Between Signup and Login
export function resendAuthEmail(
    userEmail,
    setMessage,
    setEmailErr,
) {
    fetch(
        "http://localhost:8080/v1/auth/send-password-authentication-email",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: userEmail }),
        }
    )
        .then(async (response) => {
            const text = await response.text();
            setMessage(text);
            setEmailErr(false);
        })
        .catch((error) => {
            setMessage("Error occurred: " + error);
        });
}

export function ErrorMessage({ response, message, style }) {
    let displayErrMsgLogic = null;

    if (response && response.status === 200) {
        displayErrMsgLogic = (
            <div className={style["success-msg-wrapper"]}>
                <div className={style["success-msg"]}>{message}</div>
            </div>
        );
    } else if (response && response.status !== 200) {
        displayErrMsgLogic = (
            <div className={style["error-msg-wrapper"]}>
                <div className={style["error-msg"]}>
                    <i className="fa fa-times-circle" />
                    {message}
                </div>
            </div>
        );
    }

    return displayErrMsgLogic;
}


export function togglePasswordVisibility(
    passwordVisible,
    setPasswordVisible
) {
    setPasswordVisible(!passwordVisible);
}
