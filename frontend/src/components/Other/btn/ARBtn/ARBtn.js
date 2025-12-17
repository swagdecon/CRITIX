import React from "react"
import ARBtnStyle from "../WatchListBtn/WatchListBtn.module.css"
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function ARBtn({ movieName }) {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate(`/ar/${encodeURIComponent(movieName)}`)
    }

    return (
        <div className={ARBtnStyle["circle-container"]}>
            <div className={ARBtnStyle["action-btn"]}>
                <i><ViewInArIcon sx={{ fontSize: 30 }} onClick={handleClick} /></i>
            </div>
        </div>
    )
}
ARBtn.propTypes = {
    movieName: PropTypes.string.isRequired
}