import ReviewStyle from "./OtherReviews.module.css";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { sendData } from "../../../security/Data";
const deleteUserReviewEndpoint = process.env.REACT_APP_DELETE_USER_REVIEW_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL
export default function DeleteReviewPopup({ movieId, onSuccess }) {
    const [message, setMessage] = useState(null)
    async function handleDeleteReview() {
        const response = await sendData(`${API_URL}${deleteUserReviewEndpoint}${movieId}`);
        response.ok ? onSuccess(false) : setMessage("Something went wrong")
    }
    return (
        <div>
            <h3 className={ReviewStyle.popup__title}>Are you sure you want to delete your review?</h3>
            <div className={ReviewStyle.popup__content}>
                {!message ?
                    <button className={ReviewStyle.delete__review__btn} onClick={handleDeleteReview}> Delete Review</button>
                    :
                    <span className={ReviewStyle.response__message}>{message}</span>}
            </div>
        </div >
    )
}

DeleteReviewPopup.propTypes = {
    onSuccess: PropTypes.func,
    movieId: PropTypes.int,
};
