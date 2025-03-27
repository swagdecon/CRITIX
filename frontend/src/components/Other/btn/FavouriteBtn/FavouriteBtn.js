import React from "react"
import FavouriteBtnStyle from "../WatchListBtn/WatchListBtn.module.css"
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import { useState } from "react";
import { sendData } from "../../../../security/Data";
import PropTypes from "prop-types";
const sendToFavouriteMoviesEndpoint = process.env.REACT_APP_ADD_TO_FAVOURITE_MOVIES_ENDPOINT;
const deleteFromFavouriteMoviesEndpoint = process.env.REACT_APP_DELETE_FROM_FAVOURITE_MOVIES_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL

export default function FavouriteBtn({ movieData, outline }) {

    const [isSavedToFavouriteMovies, setIsSavedToFavouriteMovies] = useState(movieData.isSavedToFavouriteMoviesList)
    async function handleSaveToFavouriteMovies(e) {
        e.preventDefault();
        const response = await sendData(`${API_URL}${sendToFavouriteMoviesEndpoint}`, movieData);
        response.ok ? setIsSavedToFavouriteMovies(true) : false;
        e.stopPropagation();
    }

    async function handleDeleteFromFavouriteMovies(e) {
        e.preventDefault();
        const response = await sendData(`${API_URL}${deleteFromFavouriteMoviesEndpoint}${movieData.movieId}`);
        response.ok ? setIsSavedToFavouriteMovies(false) : false;
        e.stopPropagation();
    }

    return (
        <div className={outline ? FavouriteBtnStyle["circle-container"] : null}>
            <div className={FavouriteBtnStyle["action-btn"]}>
                {!isSavedToFavouriteMovies ?
                    <i> <FavoriteBorderOutlinedIcon sx={{ fontSize: 30 }} onClick={handleSaveToFavouriteMovies} /></i>
                    :
                    <i><FavoriteOutlinedIcon sx={{ fontSize: 30 }} onClick={handleDeleteFromFavouriteMovies} /></i>
                }
            </div>
        </div>
    )
}

FavouriteBtn.propTypes = {
    outline: PropTypes.bool,
    movieData: PropTypes.shape({
        movieId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        posterUrl: PropTypes.string.isRequired,
        voteAverage: PropTypes.number.isRequired,
        genres: PropTypes.array.isRequired,
        overview: PropTypes.string.isRequired,
        actors: PropTypes.array,
        isSavedToFavouriteMoviesList: PropTypes.bool.isRequired,
    }).isRequired,
}