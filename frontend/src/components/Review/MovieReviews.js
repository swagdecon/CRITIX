import React, { useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import Filter from "bad-words";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import IndReview from "./Review.module.css";
import ReviewSection from "./ReviewList/ReviewSection";
import InputSlider from "./Slider/Slider.js";
import CookieManager from "../../security/CookieManager";
import ReCAPTCHA from "react-google-recaptcha";
import { format } from 'date-fns';
const RECAPTCHA_KEY = process.env.REACT_APP_RECAPTCHA_KEY;
const RECAPTCHA_ENDPOINT = process.env.REACT_APP_RECAPTCHA_ENDPOINT;
const CREATE_MOVIE_ENDPOINT = process.env.REACT_APP_CREATE_MOVIE_ENDPOINT;
const API_URL = process.env.REACT_APP_BACKEND_API_URL



export default function MovieReviews({ reviews, movieId, movieTitle }) {
    let token = CookieManager.decryptCookie('accessToken');
    const decodedToken = jwtDecode(token);
    const firstName = decodedToken.firstName;
    const filter = useMemo(() => new Filter(), []);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [disabledInput, setDisabledInputLogic] = useState(false);
    const [hasSubmittedReview, setHasSubmittedReview] = useState(false);
    const [recaptchaResult, setRecaptchaResult] = useState(false)
    const hasReviewProfanity = useMemo(() => filter.isProfane(reviewContent), [filter, reviewContent]);
    const isRecaptchaVisible = useMemo(() => reviewContent.trim().length != 0 && reviewRating != 0 && !hasReviewProfanity[reviewContent, reviewRating, hasReviewProfanity]);
    const wordCount = reviewContent.trim().split(/\s+/).length;

    const isSubmitDisabled = useMemo(() =>
        reviewContent.trim().length === 0 ||
        reviewRating === 0 ||
        wordCount < 40 ||
        !recaptchaResult,
        [reviewContent, reviewRating, recaptchaResult]
    );

    const reviewInputStyles = {
        width: "80%",
        borderRadius: "15px",
        fieldSet: {
            borderRadius: "15px"
        },
        input: {
            color: "white !important"
        },
        "& .MuiOutlinedInput-root": {
            "& fieldset": {
                borderColor: hasReviewProfanity ? "red" : "white",
            },
            "&:hover fieldset": {
                borderColor: hasReviewProfanity ? "red" : "#0096ff",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#0096ff",
            },
            "&.Mui-error fieldset": {
                borderColor: "red",
            },
        },
        "& ::-webkit-scrollbar": {
            width: "12px",
            backgroundColor: "rgb(73, 73, 73)",
            borderRadius: "10px",
        },
        "& ::-webkit-scrollbar-track": {
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.3)",
            borderRadius: "10px",
        },
        "& ::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,.3)",
            backgroundColor: "#0096ff",
        },
        '@media (max-width: 600px)': {
            width: '60vw',
        }
    };

    async function onChange(token) {
        try {
            await axios.post(`${API_URL}${RECAPTCHA_ENDPOINT}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                recaptchaValue: token
            }).then(res =>
                setRecaptchaResult(res.data.success))
        } catch (e) {
            console.error(e)
        }
    }


    const handleSubmit = useCallback(() => {
        if (!hasReviewProfanity) {
            const currentDate = new Date();
            // DO NOT CHANGE
            const formattedDate = format(currentDate, 'MM-dd-yyyy HH:mm');

            axios
                .post(`${API_URL}${CREATE_MOVIE_ENDPOINT}${movieId}`, {
                    createdDate: formattedDate,
                    movieId,
                    movieTitle,
                    author: firstName,
                    rating: reviewRating,
                    content: reviewContent,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then(() => {
                    setReviewRating(0);
                    setReviewContent("");
                    setHasSubmittedReview(true);
                    setDisabledInputLogic(true);
                })
                .catch((error) => {
                    if (error.response.status === 400 && error.response.data === "User already submitted a review for this movie.") {
                        setHasSubmittedReview(true);
                    }
                });
        }
    }, [movieId, decodedToken, reviewRating, reviewContent, token, hasReviewProfanity]);

    return (
        <div className={IndReview["ind-review-wrapper"]}>
            <div className={IndReview["user-review-wrapper"]}>
                <div className={IndReview["textField-wrapper"]}>
                    <InputSlider onSliderChange={setReviewRating} />
                    <br />
                    <TextField
                        label={
                            hasReviewProfanity && reviewContent.trim().length > 0
                                ? "Profanity is not allowed."
                                : hasSubmittedReview
                                    ? "Thanks for submitting a review!  "
                                    : "Post A Review (Min. 40 words)"
                        }
                        multiline
                        onChange={(e) => setReviewContent(e.target.value)}
                        maxRows={4}
                        value={reviewContent}
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
                        sx={reviewInputStyles}
                    />

                    {!hasSubmittedReview && !hasReviewProfanity && (
                        <div>
                            {isRecaptchaVisible && (
                                <div className={IndReview["recaptcha-btn"]}>
                                    <ReCAPTCHA
                                        sitekey={RECAPTCHA_KEY}
                                        onChange={onChange}
                                    />
                                </div>
                            )}
                            <div className={IndReview["post-review-btn"]}>
                                <Button
                                    variant="contained"
                                    endIcon={<MovieCreationOutlinedIcon />}
                                    size="medium"
                                    onClick={handleSubmit}
                                    disabled={isSubmitDisabled}>
                                    SUBMIT
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {reviews && reviews.length >= 2 && (
                <div className={IndReview.IndReviewWrapper}>
                    <ReviewSection reviews={reviews} movieId={movieId} />
                </div>
            )}
        </div>
    );
}

MovieReviews.propTypes = {
    voteAverage: PropTypes.number,
    movieTitle: PropTypes.string,
    reviews: PropTypes.array,
    movieId: PropTypes.number,
};
