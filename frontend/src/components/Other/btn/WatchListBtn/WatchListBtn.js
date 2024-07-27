import React from "react"
import WatchListBtnStyle from "./WatchListBtn.module.css"
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useState } from "react";
import { sendData } from "../../../../security/Data";
import PropTypes from "prop-types";
const sendToWatchListEndpoint = process.env.REACT_APP_ADD_TO_WATCHLIST_ENDPOINT;
const deleteFromWatchListEndpoint = process.env.REACT_APP_DELETE_FROM_WATCHLIST_ENDPOINT;

export default function WatchListBtn({ movieData, outline }) {
    const [isSavedToWatchList, setIsSavedToWatchList] = useState(movieData.isSavedToWatchlist)

    async function handleSaveToWatchlist(e) {
        e.preventDefault();
        const response = await sendData(sendToWatchListEndpoint, movieData);
        response.ok ? setIsSavedToWatchList(true) : false;
        e.stopPropagation();
    }

    async function handleDeleteFromWatchlist(e) {
        e.preventDefault();
        const response = await sendData(`${deleteFromWatchListEndpoint}${movieData.movieId}`);
        response.ok ? setIsSavedToWatchList(false) : false;
        e.stopPropagation();
    }

    return (
        <div className={outline ? WatchListBtnStyle["circle-container"] : null}>
            <div className={WatchListBtnStyle["action-btn"]}>
                {!isSavedToWatchList ?
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
    outline: PropTypes.bool.isRequired,
    movieData: PropTypes.shape({
        movieId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        posterUrl: PropTypes.string.isRequired,
        voteAverage: PropTypes.number.isRequired,
        genres: PropTypes.array.isRequired,
        overview: PropTypes.string.isRequired,
        actors: PropTypes.array,
        isSavedToWatchlist: PropTypes.bool.isRequired,
    }).isRequired,
}