import { React, useState } from "react";
import IndReview from "./Review.module.css";
import TextField from '@mui/material/TextField'
import Filter from "bad-words";
import Button from "@mui/material/Button"
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import UserRating from "./Rating/UserRating";
import PropTypes from "prop-types";
// import { MovieAverage } from "../IndMovie/MovieComponents";
// import CookieManager from "../../security/CookieManager";
// import jwt_decode from "jwt-decode";
import PercentageRatingCircle from "./Rating/PercentageCircle";
export default function MovieComments({ voteAverage }) {
    MovieComments.propTypes = {
        voteAverage: PropTypes.number,
    }
    const percentageAverage = voteAverage * 10
    console.log(percentageAverage);
    // const token = CookieManager.decryptCookie("accessToken");
    // const firstName = jwt_decode(token).firstName;

    const [review, setReview] = useState("");
    const filter = new Filter();
    const hasReviewProfanity = filter.isProfane(review);
    return (
        <div className={IndReview["ind-review-wrapper"]}>
            <h2 className={IndReview["ind-review-section-title"]}>Reviews</h2>

            < div className={IndReview["review-content-wrapper"]}>
                <div className={IndReview["movie-vote-average"]}>
                    <PercentageRatingCircle percentageRating={percentageAverage} />
                    {/* <MovieAverage voteAverage={voteAverage} /> */}
                </div>
                <div className={IndReview["input-wrapper"]}>

                    <div className={IndReview["rating-wrapper"]}>
                        <UserRating />
                    </div>
                    {/* <div className={IndReview["name-wrapper"]}>
                        {firstName}
                    </div> */}
                    <div className={IndReview["user-review-wrapper"]}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label={hasReviewProfanity && review.trim().length > 0 ? "Profanity is not allowed." : "Post A Review"}
                            multiline
                            onChange={(e) => setReview(e.target.value)}
                            maxRows={4}
                            className={IndReview["mui-input-field"]}
                            InputLabelProps={{
                                style: {
                                    color: 'white',
                                },
                            }}
                            inputProps={{
                                sx: {
                                    color: 'white',

                                },
                            }}
                            error={hasReviewProfanity && review.trim().length > 0}
                            sx={{
                                borderRadius: "30px",
                                fieldSet: {
                                    borderRadius: "30px",
                                },
                                input: {
                                    color: "white !important"
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'white',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: hasReviewProfanity && review.trim().length > 0 ? '#ff0000' : '#0096ff',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: hasReviewProfanity && review.trim().length > 0 ? '#ff0000' : '#0096ff',
                                    },
                                },
                                width: "65%",
                            }}
                        />
                        <div className={IndReview["post-review-btn"]}>
                            <Button
                                variant="contained"
                                endIcon={<MovieCreationOutlinedIcon />}
                                size="large"
                                sx={{
                                    borderRadius: "30px",
                                }}
                            >
                                POST REVIEW
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

