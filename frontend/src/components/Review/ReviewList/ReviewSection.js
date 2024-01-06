import React, { useState, useMemo, useCallback } from "react";
import ReviewStyle from "./OtherReviews.module.css";
import UserRating from "../Rating/UserRating/UserRating";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import parse from 'html-react-parser';
import Popup from 'reactjs-popup';
import DeleteReviewPopup from "./DeleteReviewPopup";

export default function ReviewSection({ reviews, movieId, userId }) {
    const [currentPage, setCurrentPage] = useState(1);

    const commentsPerPage = 2;
    const handlePageChange = useCallback((event, page) => setCurrentPage(page));
    const totalPages = Math.ceil(reviews.length / commentsPerPage);
    const displayReviews = useMemo(() => {
        let reviewsToDisplay = [];
        const startIdx = (currentPage - 1) * commentsPerPage;
        const endIdx = startIdx + commentsPerPage;
        reviewsToDisplay = reviews.slice(startIdx, endIdx);
        return reviewsToDisplay;
    }, [currentPage, reviews]);


    return (
        <div className={ReviewStyle["comment-section"]}>
            <div className={ReviewStyle.container}>
                <div className={ReviewStyle.review}>
                    <div className={ReviewStyle["comment-section"]}>
                        {displayReviews.map((review) => (
                            <div className={ReviewStyle["user-review"]} key={review.author}>
                                <div className={`${ReviewStyle["media"]} ${ReviewStyle["media-review"]}`} >
                                    <div className={ReviewStyle["media-user"]}>
                                        <img
                                            src={review.avatar}
                                            className={ReviewStyle["profile-picture"]}
                                            alt="user-profile-image"
                                        />
                                    </div>
                                    <div className={ReviewStyle["media-body"]}>
                                        <div className={ReviewStyle["M-flex"]}>
                                            <h4 className={ReviewStyle.title}>
                                                <span> {review.author}{" "}</span>
                                                {review.createdDate}
                                            </h4>

                                            <div className={ReviewStyle["rating-row"]}>
                                                {review.rating ? (
                                                    <UserRating percentage={(review.reviewId == null ? review.rating * 10 : parseInt(review.rating))} />
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className={ReviewStyle.description}>{parse(review.content)}</div>
                                        {review.userId === userId ?
                                            <div className={ReviewStyle.delete__review}>
                                                <Popup trigger={
                                                    <button className={ReviewStyle.delete__review__btn}>DELETE REVIEW</button>} modal> <DeleteReviewPopup movieId={movieId} userId={userId} /> </Popup>
                                            </div> : null}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {reviews && reviews.length > 0 && totalPages > 0 && (
                        <Pagination
                            size="large"
                            color="primary"
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: "#ffffff",
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </div >
    );
}

ReviewSection.propTypes = {
    movieId: PropTypes.integer,
    userId: PropTypes.string,
    reviews: PropTypes.array,
};
