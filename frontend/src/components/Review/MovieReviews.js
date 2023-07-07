import { React, useState, useRef, useEffect, useMemo, useCallback } from "react";
import IndReview from "./Review.module.css";
import TextField from '@mui/material/TextField';
import Filter from "bad-words";
import Button from "@mui/material/Button";
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import PropTypes from "prop-types";
import PercentageRatingCircle from "./Rating/PercentageCircle/PercentageCircle";
import InputSlider from "./Rating/Slider/Slider.js";
import OtherReviews from "./ReviewList/OtherReviews";
import ReactTextCollapse from "react-text-collapse/dist/ReactTextCollapse";
import useFetchData from "../../security/FetchApiData";
import IndMovieStyle from "../IndMovie/ind_movie.module.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import CookieManager from "../../security/CookieManager";

UserMovieReviews.propTypes = {
    voteAverage: PropTypes.number,
    movieId: PropTypes.number,
    placement: PropTypes.string
};

export default function UserMovieReviews({ voteAverage, movieId, placement }) {
    const { data: userReviews, dataLoaded, refetchData } = useFetchData(
        useMemo(() => `http://localhost:8080/review/${movieId}`, [movieId])
    );
    const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
    const decodedToken = useMemo(() => jwt_decode(token), [token]);
    const filter = useMemo(() => new Filter(), []);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [disabledInput, setDisabledInputLogic] = useState(false);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
    const hasReviewProfanity = useMemo(() => filter.isProfane(reviewContent), [filter, reviewContent]);
    const isSubmitDisabled = useMemo(() => reviewContent.trim().length === 0 || reviewRating === 0, [reviewContent, reviewRating]);
    const [maxHeight, setMaxHeight] = useState(500);



    const handleSubmit = useCallback(() => {
        if (!hasReviewProfanity) {
            const currentDate = new Date();
            const day = currentDate.getDate().toString().padStart(2, "0");
            const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
            const year = currentDate.getFullYear().toString();
            const formattedDate = `${day}-${month}-${year}`;
            const userId = decodedToken.userId;
            axios
                .post(`http://localhost:8080/review/create/${movieId}`, {
                    createdDate: formattedDate,
                    movieId: movieId,
                    userId: userId,
                    author: decodedToken.firstName,
                    rating: reviewRating,
                    content: reviewContent,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setReviewRating(0);
                    setReviewContent("");
                    setHasSubmittedReview(true);
                    setDisabledInputLogic(true);
                    refetchData();
                })
                .catch((error) => {
                    if (error.response.status === 400 && error.response.data === "User already submitted a review for this movie.") {
                        setHasSubmittedReview(true);
                    }
                    // console.log(error)
                });
        }
    }, [movieId, decodedToken, reviewRating, reviewContent, token, refetchData]);
    const reviewRef = useRef(null);

    useEffect(() => {
        if (reviewRef.current) {
            const reviewHeight = reviewRef.current.offsetHeight;
            setMaxHeight(reviewHeight);
        }
    }, [userReviews]);

    if (placement === "userRatingSection") {
        const percentageVoteAverage = useMemo(() => voteAverage.toFixed(1) * 10, [voteAverage]);
        return (
            <div className={IndReview["ind-review-wrapper"]}>
                <div className={IndReview["input-wrapper"]}>
                    <div className={IndReview["total-rating-wrapper"]}>
                        <PercentageRatingCircle percentageRating={percentageVoteAverage} />
                    </div>
                    <div className={IndReview["user-review-wrapper"]}>
                        <div className={IndReview["user-info-wrapper"]} />
                        <div className={IndReview["textField-wrapper"]}>
                            <div className={IndReview["input-slider"]}>
                                <InputSlider onSliderChange={setReviewRating} />
                            </div>
                            <TextField
                                size="small"
                                id="outlined-multiline-flexible"
                                label={
                                    hasReviewProfanity && reviewContent.trim().length > 0
                                        ? "Profanity is not allowed."
                                        : hasSubmittedReview
                                            ? "You have already submitted a review for this movie."
                                            : "Post A Review"
                                }
                                multiline
                                onChange={(e) => setReviewContent(e.target.value)}
                                maxRows={4}
                                value={reviewContent}
                                className={IndReview["mui-input-field"]}
                                InputLabelProps={{
                                    style: {
                                        color: "white"
                                    }
                                }}
                                inputProps={{
                                    disabled: disabledInput,
                                    sx: {
                                        color: "white"
                                    }
                                }}
                                error={hasReviewProfanity && reviewContent.trim().length > 0}
                                sx={{
                                    borderRadius: "15px",
                                    fieldSet: {
                                        borderRadius: "15px"
                                    },
                                    input: {
                                        color: "white !important"
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "white"
                                        },
                                        "&:hover fieldset": {
                                            borderColor:
                                                hasReviewProfanity && reviewContent.trim().length > 0
                                                    ? "#ff0000"
                                                    : "#0096ff"
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor:
                                                hasReviewProfanity && reviewContent.trim().length > 0
                                                    ? "#ff0000"
                                                    : "#0096ff"
                                        }
                                    },
                                    width: "60%"
                                }}
                            />
                            {!hasSubmittedReview && !hasReviewProfanity && (
                                <div className={IndReview["post-review-btn"]}>
                                    <Button
                                        variant="contained"
                                        endIcon={<MovieCreationOutlinedIcon />}
                                        size="medium"
                                        onClick={handleSubmit}
                                        disabled={isSubmitDisabled}
                                        sx={{
                                            borderRadius: "15px"
                                        }}
                                    >
                                        SUBMIT
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {dataLoaded && userReviews && userReviews.length >= 2 && (
                    <OtherReviews reviews={userReviews} />
                )}
            </div>
        );
    } else if (placement === "header") {


        const TEXT_COLLAPSE_OPTIONS = {
            collapse: false,
            collapseText: "...show more",
            expandText: "show less",
            minHeight: 210,
            maxHeight: 300,
            textStyle: {
                color: "grey",
                fontSize: "20px"
            }
        };
        return (
            <div className={IndMovieStyle.review__wrapper} ref={reviewRef}>
                {dataLoaded &&
                    userReviews &&
                    Object.keys(userReviews)
                        .slice(0, 2)
                        .map((key, index) => (
                            <ReactTextCollapse
                                key={index}
                                options={{ ...TEXT_COLLAPSE_OPTIONS, maxHeight }}
                            >
                                <p className={IndMovieStyle.review__description}>
                                    {userReviews[key].content}
                                </p>
                                <br />
                            </ReactTextCollapse>
                        ))}
            </div>
        );
    }
}
