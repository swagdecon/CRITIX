import React from "react"
import "./UserRating.css"
import PropTypes from "prop-types"
export default function UserRating({ percentage }) {
    UserRating.propTypes = {
        percentage: PropTypes.number
    }
    switch (true) {
        case (percentage >= 0 && percentage < 40):
            return <div className="user-rating-bad">{percentage}</div>
        case (percentage >= 40 && percentage < 60):
            return <div className="user-rating-mid">{percentage}</div>
        case (percentage >= 60 && percentage < 80):
            return <div className="user-rating-good">{percentage}</div>
        case (percentage >= 80 && percentage <= 100):
            return <div className="user-rating-excellent">{percentage}</div>
    }
}