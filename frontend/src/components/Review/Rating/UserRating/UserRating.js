import React from "react"
import RatingStyle from "./UserRating.module.css"
import PropTypes from "prop-types"
export default function UserRating({ percentage }) {

    switch (true) {
        case (percentage >= 0 && percentage < 40):
            return <div className={RatingStyle["user-rating-bad"]}>{percentage} kernels</div>
        case (percentage >= 40 && percentage < 60):
            return <div className={RatingStyle["user-rating-mid"]}>{percentage}  kernels</div>
        case (percentage >= 60 && percentage < 80):
            return <div className={RatingStyle["user-rating-good"]}>{percentage}  kernels</div>
        case (percentage >= 80 && percentage <= 100):
            return <div className={RatingStyle["user-rating-excellent"]}>{percentage}  kernels</div>
    }
}
UserRating.propTypes = {
    percentage: PropTypes.number
}