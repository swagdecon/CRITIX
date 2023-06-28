import { React, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
// import popcornIcon from './popcornRatingIcon.png';
import PropTypes from "prop-types";

const Input = styled(MuiInput)`
  width: 42px;
`;

InputSlider.propTypes = {
    onSliderChange: PropTypes.func,
};
export default function InputSlider({ onSliderChange }) {
    const [value, setValue] = useState(30);

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
        onSliderChange(newValue); // Call the callback function
    };

    const handleInputChange = (event) => {
        setValue(event.target.value === "" ? "" : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

    return (
        <Box sx={{ width: 250 }}>
            <Typography id="input-slider" gutterBottom>
                {/* Kernel Rating */}
            </Typography>
            <Grid container spacing={1} alignItems="left">
                {/* <Grid item>
            <img style={{ width: "50%" }} src={popcornIcon} />
          </Grid> */}
                <Grid item xs>
                    <Slider
                        value={typeof value === "number" ? value : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        value={value}
                        size="small"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: "number",
                            "aria-labelledby": "input-slider"
                        }}
                        sx={{
                            color: "white"
                        }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}