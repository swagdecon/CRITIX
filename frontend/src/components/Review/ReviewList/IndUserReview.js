import React, { useState } from "react";
import TimeAgo from 'react-timeago'
import PropTypes from "prop-types";
import UserReviewStyle from "./UserReview.module.css"

export function getColourClassName(rating) {
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
// Both author and movieTitle should not be both passed, one or the other depending on the page (userProfile or indMovie, compared using placement variable)
export default function IndUserReview({ placement, avatar, author, movieTitle, createdDate, content, containsSpoiler, rating, tier, tags = [] }) {
    const [spoilerRevealed, setSpoilerRevealed] = useState(false);
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
                                    {placement === 'userProfile' ? (
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
                            {containsSpoiler && !spoilerRevealed && (
                                <div className={UserReviewStyle.SpoilerOverlay}>
                                    <div className={UserReviewStyle.SpoilerWarningText}>⚠️ Contains Spoilers</div>
                                    <button className={UserReviewStyle.RevealSpoilerButton} onClick={() => setSpoilerRevealed(true)}>Reveal</button>
                                </div>
                            )}
                            <div
                                className={UserReviewStyle.ReviewContent}
                                style={{ filter: containsSpoiler && !spoilerRevealed ? 'blur(12px)' : 'none' }}
                            >
                                {content}
                            </div>
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
        </div>
    );
}

IndUserReview.propTypes = {
    placement: PropTypes.string,
    avatar: PropTypes.string,
    author: PropTypes.string,
    movieTitle: PropTypes.string,
    createdDate: PropTypes.string,
    containsSpoiler: PropTypes.bool,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rating: PropTypes.number,
    tier: PropTypes.oneOf(["CritixPro", "CritixUltimate"]),
    tags: PropTypes.arrayOf(PropTypes.string),
};