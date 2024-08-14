import React, { useState } from "react";
import { sendData } from "../../../security/Data.js";
import UserStyle from "../UserProfile.module.css"
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
const UPDATE_EMAIL_ENDPOINT = process.env.REACT_APP_UPDATE_EMAIL_ENDPOINT

export default function InfoUpdate() {
    const [fieldMsg, setFieldMsg] = useState(null);
    const [fieldMsgErr, setFieldMsgErr] = useState(null);
    const navigate = useNavigate();

    const handleResetPassword = () => {
        navigate('/forgot-password');
    };

    async function SubmitEmailChange() {
        const response = await sendData(UPDATE_EMAIL_ENDPOINT);
        if (response.ok) {
            setFieldMsg("Please reset your email through the link we sent your email address.")
        } else {
            setFieldMsgErr(await response.text())
            console.error(response)
        }
    }
    return (
        <div className={UserStyle.UserSettings}>
            <div className={UserStyle.UserSettingsBox}>
                <h2 className={UserStyle.Title}>General Information</h2>
                {fieldMsgErr ? (
                    <div className={UserStyle.SubmitInfoErr}>{fieldMsgErr}</div>
                ) : fieldMsg ? (
                    <div className={UserStyle.SubmitInfo}>{fieldMsg}</div>
                ) : null}
                <form className={UserStyle.UpdateInfoForm}>
                    <div className={UserStyle.BtnWrapper}>
                        <Button fullWidth sx={{ width: "50%" }} onClick={SubmitEmailChange} variant="contained">Reset Email</Button>
                    </div>
                </form >
                <div className={UserStyle.RedirectResetPwd}>
                    <Button fullWidth sx={{ width: "50%" }} onClick={handleResetPassword} variant="contained" >Reset Password</Button>
                </div >
            </div >
        </div>
    )
}