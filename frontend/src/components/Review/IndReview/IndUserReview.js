import TimeAgo from 'react-timeago'
import React from "react";
import PropTypes from "prop-types";
import UserReviewStyle from "./UserReview.module.css"

function getColourClassName(rating) {
    if (rating >= 80) {
        return "blue"
    } else if (rating >= 60) {
        return "green"
    } else if (rating >= 40) {
        return "yellow"
    } else {
        return "red"
    }
}
// Both author and movieTitle should not be both passed, one or the other depending on the page (userProfile or indMovie)
export default function IndUserReview({ avatar, author, movieTitle, createdDate, content, rating }) {
    const colourRating = getColourClassName(rating);
    return (
        <div className={UserReviewStyle.IndUserReviews}>
            <div className={UserReviewStyle.ContentWrapper}>
                <div className={UserReviewStyle.ReviewInfoWrapper}>
                    <div className={UserReviewStyle.ReviewInfo}>
                        <div className={UserReviewStyle.ProfilePic}>
                            <img src={avatar} alt="User Avatar" />
                        </div>
                        <div className={UserReviewStyle.Review}>
                            <div className={UserReviewStyle.ReviewHeader}>
                                <div className={UserReviewStyle.ReviewHeaderCol}>
                                    {/* Essentially we want to display either the movie title for the user profile page OR the username for the reviews on the ind movie page, no reason to have both where it doesnt make sense */}
                                    {movieTitle ?
                                        <div className={UserReviewStyle.MovieTitle}>{movieTitle}</div>
                                        :
                                        author ?
                                            <div className={UserReviewStyle.Author}>{author}</div>
                                            : null}
                                    <div className={UserReviewStyle.TimeAgo}>
                                        <TimeAgo date={new Date(createdDate)} />
                                    </div>
                                </div>
                                {rating ?
                                    <div className={`${UserReviewStyle.ReviewRating} ${UserReviewStyle[colourRating]}`}>
                                        {rating}
                                    </div>
                                    : null}
                            </div>
                            <div className={UserReviewStyle.ReviewContent}>{content}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
IndUserReview.propTypes = {
    avatar: PropTypes.string.isRequired,
    author: PropTypes.string,
    movieTitle: PropTypes.string.isRequired,
    createdDate: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
};
