import React from "react"
import MovieTrailerBtnStyle from "../WatchListBtn/WatchListBtn.module.css"
import TheatersIcon from '@mui/icons-material/Theaters';
import PropTypes from "prop-types";

export default function MovieTrailerBtn({ movieTrailer }) {
    if (!movieTrailer) return null;

    return (
        <a
            href={movieTrailer}
            target="_blank"
            rel="noopener noreferrer"
            className={MovieTrailerBtnStyle["circle-container"]}
        >
            <div className={MovieTrailerBtnStyle["action-btn"]}>
                <TheatersIcon sx={{ fontSize: 30, color: 'var(--accent-color)' }} />
            </div>
        </a>
    );
}


MovieTrailerBtn.propTypes = {
    movieTrailer: PropTypes.string
};
