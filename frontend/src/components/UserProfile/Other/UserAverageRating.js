import React from "react"
import UserReviewStyle from "../../Review/ReviewList/UserReview.module.css"
import { getColourClassName } from "../../Review/ReviewList/IndUserReview"
import PropTypes from "prop-types";

export default function UserAverageRating({ averageRating }) {
    const colourRating = getColourClassName(averageRating);
    console.log(colourRating)
    return (
        <div className={UserReviewStyle.ReviewRatingWrapper}>
            <div className={UserReviewStyle.title}>average review rating</div>
            <div className={`${UserReviewStyle.AverageRating} ${UserReviewStyle[colourRating]}`}>
                {averageRating}
            </div>
        </div>
    )
}
UserAverageRating.propTypes = {
    averageRating: PropTypes.number,
};