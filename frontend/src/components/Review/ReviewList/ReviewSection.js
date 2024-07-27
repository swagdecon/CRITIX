import React, { useState, useMemo, useCallback } from "react";
// import ReviewStyle from "./OtherReviews.module.css";
// import UserRating from "../Rating/UserRating/UserRating";
import Pagination from "@mui/material/Pagination";
import PropTypes from "prop-types";
import parse from 'html-react-parser';
// import Popup from 'reactjs-popup';
// import DeleteReviewPopup from "./DeleteReviewPopup";
import IndUserReview from "../../Review/NewReview/IndUserReview";

export default function ReviewSection({ reviews }) {
    const [currentPage, setCurrentPage] = useState(1);
    // const [showDeleteBtn, setShowDeleteBtn] = useState(true);

    // const handleDeleteBtnVisibility = (visibility) => {
    //     setShowDeleteBtn(visibility);
    // };
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
        <>
            {displayReviews.map((review) => (
                <IndUserReview key={review.author} avatar={review.avatar} movieTitle={review.movieTitle} createdDate={review.createdDate} content={parse(review.content)} rating={review.rating} />
            ))}
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
        </>
    );
}

ReviewSection.propTypes = {
    movieId: PropTypes.integer,
    reviews: PropTypes.array,
};
