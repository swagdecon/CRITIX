import React from "react"
import WatchListBtnStyle from "./WatchListBtn.module.css"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useState } from "react";
import { sendData } from "../../../../security/Data";
import PropTypes from "prop-types";
const sendToWatchListEndpoint = process.env.REACT_APP_ADD_TO_WATCHLIST_ENDPOINT;
const deleteFromWatchListEndpoint = process.env.REACT_APP_DELETE_FROM_WATCHLIST_ENDPOINT;

export default function WatchListBtn({ movieData }) {
    const [isSavedToWatchListState, setIsSavedToWatchListState] = useState(movieData.isSavedToWatchlist)

    const data = {
        movieId: movieData.id,
        title: movieData.title,
        posterUrl: movieData.posterUrl,
        voteAverage: movieData.voteAverage,
        genres: movieData.genres,
        overview: movieData.overview,
        actors: movieData.actors ? movieData.actors.slice(0, 3) : null,

    };

    async function handleSaveToWatchlist(e) {
        e.preventDefault();
        const response = await sendData(sendToWatchListEndpoint, data);
        response.ok ? setIsSavedToWatchListState(true) : false;
        e.stopPropagation();
    }

    async function handleDeleteFromWatchlist(e) {
        e.preventDefault();
        const response = await sendData(`${deleteFromWatchListEndpoint}${movieData.id}`);
        response.ok ? setIsSavedToWatchListState(false) : false;
        e.stopPropagation();
    }

    return (
        <div className={WatchListBtnStyle["circle-container"]}>
            <div className={WatchListBtnStyle["action-btn"]}>
                {!isSavedToWatchListState ?
                    <i> <BookmarkBorderIcon sx={{ fontSize: 30 }} onClick={handleSaveToWatchlist} /></i>
                    :
                    <i><BookmarkIcon sx={{ fontSize: 30 }} onClick={handleDeleteFromWatchlist} /></i>
                }
            </div>
        </div>
    )
}

WatchListBtn.propTypes = {
    isSavedToWatchlist: PropTypes.bool.isRequired,
    movieData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        posterUrl: PropTypes.string.isRequired,
        voteAverage: PropTypes.number.isRequired,
        genres: PropTypes.array.isRequired,
        overview: PropTypes.string.isRequired,
        actors: PropTypes.array,
        isSavedToWatchlist: PropTypes.bool.isRequired,
    }).isRequired,
}