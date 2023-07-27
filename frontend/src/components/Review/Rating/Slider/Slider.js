import { React, useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import PropTypes from "prop-types";
import { styled } from '@mui/material/styles';

const PopflixSlider = styled(Slider)({
    color: '#0096ff',
    height: 8,
    width: "55%",
    '& .MuiSlider-track': {
        border: 'none',
    },
    '& .MuiSlider-thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
            boxShadow: 'inherit',
        },
        '&:before': {
            display: 'none',
        },
    },
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#0096ff',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': { display: 'none' },
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
    },
});


export default function InputSlider({ onSliderChange }) {
    const [value, setValue] = useState(20);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        onSliderChange(newValue);
    };

    return (
        <Box sx={{ m: 3 }}>
            <PopflixSlider
                value={value}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                aria-label="popflix slider"
                defaultValue={20}
            />
        </Box>
    )
}
InputSlider.propTypes = {
    onSliderChange: PropTypes.func,
};