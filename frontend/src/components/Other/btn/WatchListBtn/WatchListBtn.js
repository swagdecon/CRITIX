import React from "react"
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import WatchListBtnStyle from "./WatchListBtn.module.css"
import { useState } from "react";
import { sendData } from "../../../../security/FetchApiData";
import PropTypes from "prop-types";
export default function WatchListBtn({ movieData, userId, sendToWatchListEndpoint, deleteFromWatchListEndpoint }) {
    const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(movieData.isSavedToWatchlist);

    const handleClick = async () => {
        if (!isAddedToWatchlist) {
            const data = {
                movieId: movieData.id,
                title: movieData.title,
                posterUrl: movieData.posterUrl,
                voteAverage: movieData.voteAverage,
                genres: movieData.genres,
                overview: movieData.overview,
                actors: movieData.actors ? movieData.actors.slice(0, 3) : null,
                userId: userId
            };

            const response = await sendData(`${sendToWatchListEndpoint}${userId}`, data);
            response.ok ? setIsAddedToWatchlist(true) : setIsAddedToWatchlist(false);
        } else {
            const response = await sendData(`${deleteFromWatchListEndpoint}${userId}/${movieData.id}`);
            response.ok ? setIsAddedToWatchlist(false) : setIsAddedToWatchlist(true);

        }
    };

    return (
        <div className={WatchListBtnStyle["btn-container"]}>
            <div className={WatchListBtnStyle['btn']} tabIndex="0" onClick={handleClick}>
                <div className={WatchListBtnStyle['add-icon']}>
                    {isAddedToWatchlist ?
                        <CheckIcon />
                        :
                        <AddIcon />}
                </div>
                <div className={WatchListBtnStyle['watchlist-label']}>
                    <span>{isAddedToWatchlist ? 'ADDED TO WATCHLIST' : 'ADD TO WATCHLIST'}</span>
                </div>
            </div>
        </div>
    )
}
WatchListBtn.propTypes = {
    userId: PropTypes.string.isRequired,
    sendToWatchListEndpoint: PropTypes.string.isRequired,
    deleteFromWatchListEndpoint: PropTypes.string.isRequired,
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