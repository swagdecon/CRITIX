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
export default function IndUserReview({ avatar, author, movieTitle, createdDate, content, rating, tier, tags = [] }) {
    const colourRating = getColourClassName(rating);
    return (
        <div className={`${UserReviewStyle.IndUserReviews} ${tier === 'CritixUltimate' ? UserReviewStyle.UltimateUser : ''}`}>
            <div className={UserReviewStyle.ContentWrapper}>
                <div className={UserReviewStyle.ReviewInfoWrapper}>
                    <div className={UserReviewStyle.ReviewInfo}>
                        <div className={UserReviewStyle.TopWrapper}>
                            <div className={UserReviewStyle.ProfilePic}>
                                <img src={avatar} alt="User Avatar" />
                            </div>
                            {rating && (
                                <div className={UserReviewStyle.ReviewRatingWrapper}>
                                    <div className={`${UserReviewStyle.ReviewRating} ${UserReviewStyle[colourRating]}`}>
                                        {rating}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={UserReviewStyle.Review}>
                            <div className={UserReviewStyle.ReviewHeader}>
                                <div className={UserReviewStyle.ReviewHeaderLeft}>
                                    {movieTitle ? (
                                        <div className={UserReviewStyle.MovieTitle}>{movieTitle}</div>
                                    ) : (
                                        author && <div className={UserReviewStyle.Author}>{author}</div>
                                    )}
                                    <div className={UserReviewStyle.TimeAgo}>
                                        <TimeAgo date={new Date(createdDate)} />
                                    </div>
                                    {tier && (
                                        <div className={`${UserReviewStyle.Badge} ${UserReviewStyle[tier]}`}>
                                            {tier === "CritixUltimate" ? "Critix Ultimate" : "Critix Pro"}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={UserReviewStyle.ReviewContent}>{content}</div>
                            {tags.length > 0 && (
                                <div className={UserReviewStyle.HighlightTags}>
                                    {tags.map((tag, idx) => (
                                        <span key={idx} className={UserReviewStyle.HighlightTag}>{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
IndUserReview.propTypes = {
    avatar: PropTypes.string,
    author: PropTypes.string,
    movieTitle: PropTypes.string,
    createdDate: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rating: PropTypes.number,
    tier: PropTypes.oneOf(["CritixPro", "CritixUltimate"]),
    tags: PropTypes.arrayOf(PropTypes.string),
};