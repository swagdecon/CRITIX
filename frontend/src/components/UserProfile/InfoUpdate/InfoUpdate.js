import React, { useState, useMemo } from "react";
import { ProfanityLogic } from "../../Shared/Shared.js"
import { sendData } from "../../../security/Data.js";
import Filter from "bad-words";
import UserStyle from "../UserProfile.module.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { reviewInputStyles } from "../../Shared/SharedMUI.js"
import { Link } from "react-router-dom";
const UPDATE_EMAIL_ENDPOINT = process.env.REACT_APP_UPDATE_EMAIL_ENDPOINT

export default function InfoUpdate() {
    const [fieldMsg, setFieldMsg] = useState(null);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [confirmEmail, setConfirmEmail] = useState("");
    const [confirmEmailError, setConfirmEmailError] = useState(null);


    const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$";

    const filter = useMemo(() => new Filter(), []);

    const commonTextFieldProps = {
        fullWidth: true,
        sx: reviewInputStyles,
        InputLabelProps: {
            style: {
                color: "white"
            }
        }
    }
    function handleEmailChange(e) {
        setEmail(e.target.value);
        setEmailError(e.target.value ? null : 'New Email is required');
    }

    function handleConfirmEmailChange(e) {
        setConfirmEmail(e.target.value);
        setConfirmEmailError(e.target.value === email ? null : 'New Emails do not match');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const hasProfanity = filter.isProfane({ target: { value: email } });

        // Trigger validation for all fields
        handleEmailChange({ target: { value: email } });
        handleConfirmEmailChange({ target: { value: confirmEmail } });


        // Check for errors
        if (emailError || confirmEmailError) {
            alert('Please fix the errors in the form');
            return;
        }

        if (!ProfanityLogic(hasProfanity)) {
            const response = await sendData(UPDATE_EMAIL_ENDPOINT, email);
            if (response.ok) {
                setFieldMsg("Please reset your email through the link we sent your current email address.")
            } else {
                console.error(response)
            }
        }
    }
    return (
        <div className={UserStyle.UserSettings}>
            <div className={UserStyle.UserSettingsBox}>
                <h2 className={UserStyle.Title}>General Information</h2>
                {fieldMsg ?
                    <div className={UserStyle.SubmitInfo}>{fieldMsg}</div>
                    : null}
                <form className={UserStyle.UpdateInfoForm}>
                    <div className={UserStyle.GridContainer}>
                        <div className={UserStyle.GridItem}>
                            <TextField
                                label="New Email"
                                value={email}
                                onChange={handleEmailChange}
                                pattern={emailPattern}
                                error={emailError !== null ? true : false}
                                helperText={emailError}
                                {...commonTextFieldProps}
                            />
                        </div>
                        <div className={UserStyle.GridItem}>
                            <TextField
                                label="Confirm New Email"
                                value={confirmEmail}
                                onChange={handleConfirmEmailChange}
                                pattern={emailPattern}
                                error={confirmEmailError === null ? false : true}
                                helperText={confirmEmailError}
                                {...commonTextFieldProps}
                            /></div>
                    </div>
                    <div className={UserStyle.BtnWrapper}>
                        <Button fullWidth sx={{ width: "50%" }} onClick={handleSubmit} variant="contained">Confirm</Button>
                    </div>
                </form >
                <div className={UserStyle.RedirectResetPwd}>
                    If you need to reset your password, please click <Link className={UserStyle.RedirectPwdLink} to="/forgot-password">here</Link>
                </div >
            </div >
        </div>
    )
}