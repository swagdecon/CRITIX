import TimeAgo from 'react-timeago'
import React from "react";
import PropTypes from "prop-types";
import UserReviewStyle from "./UserReview.module.css"
const DEFAULT_ACTOR_IMAGE = process.env.REACT_APP_DEFAULT_ACTOR_IMAGE

export default function IndUserReview({ avatar, movieTitle, createdDate, content, rating }) {
    return (
        <div className={UserReviewStyle.IndUserReviews}>
            <div className={UserReviewStyle.ContentWrapper}>
                <div className={UserReviewStyle.ReviewInfoWrapper}>
                    <div className={UserReviewStyle.ReviewInfo}>
                        <div className={UserReviewStyle.ProfilePic}>
                            <img src={avatar ? avatar : DEFAULT_ACTOR_IMAGE} alt="User Avatar" />
                        </div>
                        <div className={UserReviewStyle.Review}>
                            <div className={UserReviewStyle.ReviewHeader}>
                                <div className={UserReviewStyle.MovieTitle}>{movieTitle}</div>
                                <div className={UserReviewStyle.TimeAgo}>
                                    <TimeAgo date={new Date(createdDate)} />
                                </div>
                            </div>
                            <div className={UserReviewStyle.ReviewContent}>{content}</div>
                        </div>
                        <div className={UserReviewStyle.ReviewRating}>{rating}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
IndUserReview.propTypes = {
    avatar: PropTypes.string.isRequired,
    movieTitle: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
};
