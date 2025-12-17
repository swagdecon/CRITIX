import React from "react"
import UserStyle from "../UserProfile.module.css"
import PropTypes from "prop-types";

export default function NumberOfReviewsWritten({ numberOfReviewsWritten }) {
    return (
        <div className={UserStyle.numberOfReviewsWrapper}>
            {numberOfReviewsWritten > 0 ? (
                <div className={UserStyle.numberBadge}>
                    {numberOfReviewsWritten}
                </div>
            ) : (
                <div className={UserStyle.NoContent}>
                    Start reviewing movies to gain insights here
                </div>
            )}
        </div>
    );
}



NumberOfReviewsWritten.propTypes = {
    numberOfReviewsWritten: PropTypes.string,
};