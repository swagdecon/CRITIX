import { React, useState } from 'react';
import Slider from '@mui/material/Slider';
import PropTypes from "prop-types";
import { styled } from '@mui/material/styles';

const PopflixSlider = styled(Slider)({
    color: '#0096ff',
    height: 5,
    width: "80%",
    '& .MuiSlider-valueLabel': {
        backgroundColor: '#0096ff',
    },
    '@media (max-width: 600px)': {
        width: '60vw',
    }
});


export default function InputSlider({ onSliderChange }) {
    const [value, setValue] = useState(20);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        onSliderChange(newValue);
    };

    return (
        <PopflixSlider
            value={value}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            aria-label="popflix slider"
            defaultValue={20}
        />
    )
}
InputSlider.propTypes = {
    onSliderChange: PropTypes.func,
};