import React from "react"
import UserReviewStyle from "../../Review/ReviewList/UserReview.module.css"
import { getColourClassName } from "../../Review/ReviewList/IndUserReview"
import UserStyle from "../UserProfile.module.css"
import PropTypes from "prop-types";

export default function UserAverageRating({ averageRating }) {
    const colourRating = getColourClassName(averageRating);

    if (averageRating) {
        return (
            <div className={`${UserReviewStyle.AverageRating} ${UserReviewStyle[colourRating]}`}>
                {averageRating}
            </div>
        )
    } else {
        return (
            <div className={UserStyle.NoContent}>Start reviewing movies to gain insights here</div>
        )
    }
}
UserAverageRating.propTypes = {
    averageRating: PropTypes.number,
};