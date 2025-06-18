import React from "react"
import UserReviewStyle from "../../Review/ReviewList/UserReview.module.css"
import { getColourClassName } from "../../Review/ReviewList/IndUserReview"
import PropTypes from "prop-types";

export default function UserAverageRating({ averageRating }) {
    const colourRating = getColourClassName(averageRating);
    return (
        <div className={`${UserReviewStyle.AverageRating} ${UserReviewStyle[colourRating]}`}>
            {averageRating}
        </div>
    )
}
UserAverageRating.propTypes = {
    averageRating: PropTypes.number,
};