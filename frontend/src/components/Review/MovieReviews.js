import { React, useState } from "react";
import IndReview from "./Review.module.css";
import TextField from '@mui/material/TextField'
import Filter from "bad-words";
import Button from "@mui/material/Button"
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
import CustomizedRating from "./Rating";
export default function MovieComments() {
    const [review, setReview] = useState("");
    const filter = new Filter();
    const hasReviewProfanity = filter.isProfane(review);

    return (
        <div className={IndReview["ind-review-wrapper"]}>
            <h2 className={IndReview["ind-review-section-title"]}>Rate and Review</h2>
            <CustomizedRating />

            <div className={IndReview["input-wrapper"]}>
                <TextField
                    id="outlined-multiline-flexible"
                    label={hasReviewProfanity && review.trim().length > 0 ? "Profanity is not allowed." : "Your Review"}
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
                                borderColor: '#0096ff',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#0096ff',
                            },
                        },
                        width: "80%",
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
    );
}

