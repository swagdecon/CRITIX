import React, { useState, useMemo } from "react";
import { ProfanityLogic } from "../../Shared/Shared.js"
import Filter from "bad-words";
import UserStyle from "../UserProfile.module.css"
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { reviewInputStyles } from "../../Shared/SharedMUI.js"
const UPDATE_USER_DETAILS_ENDPOINT = process.env.REACT_APP_UPDATE_USER_DETAILS_ENDPOINT
export default function InfoUpdate() {
    const [fieldMsg, setFieldMsg] = useState(null);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$";
    const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,20}/;

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
        setEmailError(e.target.value ? '' : 'Email is required');
    }

    function handlePasswordChange(e) {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordError(passwordPattern.test(newPassword) ? '' : 'Password must be 7-20 characters long, with at least one digit, one lowercase letter, and one uppercase letter');
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
        setConfirmPasswordError(e.target.value === password ? '' : 'Passwords do not match');
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const hasProfanity = filter.isProfane({ target: { value: email } });

        // Trigger validation for all fields
        handleEmailChange({ target: { value: email } });
        handlePasswordChange({ target: { value: password } });
        handleConfirmPasswordChange({ target: { value: confirmPassword } });

        // Check for errors
        if (emailError || passwordError || confirmPasswordError) {
            alert('Please fix the errors in the form');
            return;
        }

        if (!ProfanityLogic(hasProfanity)) {
            const userData = { email, password };
            const response = await fetch(
                UPDATE_USER_DETAILS_ENDPOINT,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(userData),
                }
            );
            if (response.ok) {
                setFieldMsg("New Details Saved, If you have requested a password change, please reset it through the link we sent you.")
            }
        }
    }
    return (
        <div className={UserStyle.UserSettings}>
            <div className={UserStyle.UserSettingsBox}>
                <h2 className={UserStyle.Title}>General Information</h2>
                <div className={UserStyle.SubmitInfo}>{fieldMsg}</div>
                <form className={UserStyle.UpdateInfoForm} onSubmit={handleSubmit}>
                    <div className={UserStyle.GridContainer}>
                        <div className={UserStyle.GridItem}>
                            <TextField
                                label="Email"
                                value={email}
                                onChange={handleEmailChange}
                                pattern={emailPattern}
                                autoComplete="on"
                                error={emailError}
                                helperText={emailError}
                                {...commonTextFieldProps}
                            /></div>
                        <div className={UserStyle.GridItem}>
                            <TextField
                                label="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                pattern={passwordPattern.toString().slice(1, -1)}
                                error={passwordError}
                                helperText={passwordError}
                                {...commonTextFieldProps}
                            /></div>
                        <div className={UserStyle.GridItem}>
                            <TextField
                                label="Confirm Password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                pattern={passwordPattern.toString().slice(1, -1)}
                                error={confirmPasswordError}
                                helperText={confirmPasswordError}
                                {...commonTextFieldProps}
                            /></div>
                    </div>
                    <div className={UserStyle.BtnWrapper}>
                        <Button fullWidth sx={{ width: "50%" }} variant="contained">Confirm</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}