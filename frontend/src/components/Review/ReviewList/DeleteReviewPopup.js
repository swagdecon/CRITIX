import ReviewStyle from "./OtherReviews.module.css";
import React, { useState } from "react";
import PropTypes from "prop-types";
const deleteUserReviewEndpoint = process.env.REACT_APP_DELETE_USER_REVIEW_ENDPOINT;
import { sendData } from "../../../security/Data";

export default function DeleteReviewPopup({ movieId, userId, onSuccess }) {
    const [message, setMessage] = useState(null)
    async function handleDeleteReview() {
        const response = await sendData(`${deleteUserReviewEndpoint}${movieId}/${userId}`);
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
    userId: PropTypes.string
};
