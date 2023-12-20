import React from "react";
const SEND_AUTH_EMAIL = process.env.REACT_APP_SEND_AUTH_EMAIL_ENDPOINT;
import PropTypes from "prop-types";
// Functions Shared Between Signup and Login
export async function resendAuthEmail(
    userEmail,
    setMessage,
    setEmailErr,
) {
    try {
        const response = await fetch(
            SEND_AUTH_EMAIL,
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

export function Message({ response, message, style, profanityError }) {
    const isError = profanityError || (response?.ok === false);
    const isSuccess = response?.ok === true;

    return (
        <div className={isError ? style["error-msg-wrapper"] : isSuccess ? style["success-msg-wrapper"] : ''}>
            <div className={isError ? style["error-msg"] : isSuccess ? style["success-msg"] : ''}>
                {isError ? <i className="fa fa-times-circle" /> : ''}
                {isError ? profanityError : isSuccess ? message : ''}
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
    profanityError: PropTypes.string,
}

export function ProfanityLogic(hasProfanity, setProfanityError) {
    if (hasProfanity) {
        setProfanityError("Input(s) cannot contain profanity")
        return true
    } else {
        setProfanityError("")
        return false
    }
}

export function togglePasswordVisibility(
    passwordVisible,
    setPasswordVisible
) {
    setPasswordVisible(!passwordVisible);
}
