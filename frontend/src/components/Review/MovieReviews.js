import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import ReviewSection from "./ReviewList/ReviewSection";
import ReviewPopup from "./ReviewPopup/ReviewPopup";
import IndReview from "./Review.module.css";


export default function MovieReviews({ reviews, movieId, movieTitle, movieTagline }) {
    const [openModal, setOpenModal] = useState(false);

    return (
        <div className={IndReview["ind-review-wrapper"]}>
            <div className={IndReview["user-review-wrapper"]}>
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(true)}
                    endIcon={<MovieCreationOutlinedIcon />}
                    size="large"
                    sx={{ bgcolor: "#0096ff", '&:hover': { bgcolor: "#007acc" } }}>
                    Write a Review
                </Button>
                <ReviewPopup
                    movieId={movieId}
                    movieTitle={movieTitle}
                    movieTagline={movieTagline}
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                />
            </div>
            {reviews && reviews.length >= 0 && (
                <div className={IndReview.IndReviewWrapper}>
                    <ReviewSection reviews={reviews} movieId={movieId} openModal={openModal} setOpenModal={setOpenModal} />
                </div>
            )}
        </div>
    );
}

MovieReviews.propTypes = {
    voteAverage: PropTypes.number,
    movieTitle: PropTypes.string,
    movieTagline: PropTypes.string,
    reviews: PropTypes.array,
    movieId: PropTypes.number,
};
