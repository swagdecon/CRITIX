// import * as React from 'react';
// import { styled } from '@mui/material/styles';
// import Rating from '@mui/material/Rating';
// import IndReview from "../Review.module.css";
// import MovieCreationIcon from '@mui/icons-material/MovieCreation';
// import MovieCreationOutlinedIcon from '@mui/icons-material/MovieCreationOutlined';

// const StyledRating = styled(Rating)({
//     '& .MuiRating-iconFilled': {
//         color: '#0096ff',
//     },
//     '& .MuiRating-iconHover': {
//         color: '#0096ff',
//     },
// });

// export default function UserRating() {
//     return (
//         <div className={IndReview["rating-wrapper"]}>
//             <StyledRating
//                 name="customized-color"
//                 defaultValue={1}
//                 // getLabelText={(value) => `${value} Clapperboards ${value !== 1 ? 's' : ''}`}
//                 precision={0.5}
//                 icon={<MovieCreationIcon style={{ color: "#FFD700" }} fontSize="large" />}
//                 emptyIcon={<MovieCreationOutlinedIcon style={{ color: '#fff' }} fontSize="large" />}
//             />
//         </div>
//     );
// }