// Functions that are shared between components should be put here 

import React from "react";
import PropTypes from "prop-types";
const SEND_AUTH_EMAIL = process.env.REACT_APP_SEND_AUTH_EMAIL_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL
export function validateImageURL(url) {
    const img = new Image();
    img.src = url;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            if (img.width > 0 && img.height > 0) {
                resolve(true);
            } else {
                reject(new Error("Invalid image URL"));
            }
        };
        img.onerror = () => {
            reject(new Error("Invalid image URL"));
        };
    });
}

// Functions Shared Between Signup and Login
export async function resendAuthEmail(
    userEmail,
    setMessage,
    setEmailErr,
) {
    try {
        const response = await fetch(
            `${API_URL}${SEND_AUTH_EMAIL}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ email: userEmail }),

            }
        )
        const text = await response.text();
        setEmailErr(false);
        setMessage(text);
    } catch (error) {
        setMessage(error)
    }
}

// export function Message({ response, message, style, profanityError }) {
//     let displayErrMsgLogic = null;
//     if (profanityError) {
//         displayErrMsgLogic = (
//             <div className={style["error-msg-wrapper"]}>
//                 <div className={style["error-msg"]}>
//                     <i className="fa fa-times-circle" />
//                     {profanityError}
//                 </div>
//             </div>
//         )
//     } else if (response && !response.ok) {
//         displayErrMsgLogic = (
//             <div className={style["error-msg-wrapper"]}>
//                 <div className={style["error-msg"]}>
//                     <i className="fa fa-times-circle" />
//                     {message}
//                 </div>
//             </div>
//         );
//     } else if (response && response.ok) {
//         displayErrMsgLogic = (
//             <div className={style["success-msg-wrapper"]}>
//                 <div className={style["success-msg"]}>{message}</div>
//             </div>
//         );
//     }
//     return displayErrMsgLogic;
// }

export function Message({ response, message, style, error }) {
    const isError = error || (response?.ok === false);
    const isSuccess = response?.ok === true;

    return (
        <div className={isError ? style["error-msg-wrapper"] : isSuccess ? style["success-msg-wrapper"] : ''}>
            <div className={isError ? style["error-msg"] : isSuccess ? style["success-msg"] : ''}>
                {isError ? <i className="fa fa-times-circle" /> : ''}
                {isError ? error : isSuccess ? message : ''}
            </div>
        </div>
    );
}
Message.propTypes = {
    response: PropTypes.shape({
        ok: PropTypes.bool,
    }),
    message: PropTypes.string,
    style: PropTypes.objectOf(PropTypes.string),
    error: PropTypes.string,
}

export function ProfanityLogic(hasProfanity, setError) {
    if (hasProfanity) {
        setError("Input(s) cannot contain profanity")
        return true
    }
}

export function togglePasswordVisibility(
    passwordVisible,
    setPasswordVisible
) {
    setPasswordVisible(!passwordVisible);
}
