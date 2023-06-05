import * as React from 'react';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import IndReview from "./Review.module.css";
import MovieCreationIcon from '@mui/icons-material/MovieCreation';
import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';
const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#0096ff',
    },
    '& .MuiRating-iconHover': {
        color: '#0096ff',
    },
});

export default function CustomizedRating() {
    return (
        <div className={IndReview["rating-wrapper"]}>
            <StyledRating
                name="customized-color"
                defaultValue={2}
                getLabelText={(value) => `${value} Heart${value !== 1 ? 's' : ''}`}
                precision={0.5}
                icon={<MovieCreationIcon fontSize="large" />}
                emptyIcon={<MovieCreationOutlinedIcon fontSize="large" />}
            />
        </div>
    );
}