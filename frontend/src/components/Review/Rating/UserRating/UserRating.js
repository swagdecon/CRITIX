import React from "react"
import "./UserRating.css"
import PropTypes from "prop-types"
export default function UserRating({ percentage }) {

    switch (true) {
        case (percentage >= 0 && percentage < 40):
            return <div className="user-rating-bad">{percentage} kernels</div>
        case (percentage >= 40 && percentage < 60):
            return <div className="user-rating-mid">{percentage}  kernels</div>
        case (percentage >= 60 && percentage < 80):
            return <div className="user-rating-good">{percentage}  kernels</div>
        case (percentage >= 80 && percentage <= 100):
            return <div className="user-rating-excellent">{percentage}  kernels</div>
    }
}
UserRating.propTypes = {
    percentage: PropTypes.number
}