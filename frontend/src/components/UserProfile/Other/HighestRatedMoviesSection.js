import React from 'react';
import { BarChart } from "@mui/x-charts";
import PropTypes from "prop-types";

export default function HighestRatedMoviesSection({ userTopRatedMovies }) {
    const movieNames = Object.keys(userTopRatedMovies);
    const ratings = Object.values(userTopRatedMovies);

    return (
        <BarChart
            xAxis={[{ data: movieNames, scaleType: 'band' }]}
            series={[
                {
                    data: ratings,
                    color: ' #0096ff',
                }
            ]}
            height={300}
            barLabel="value"
            slotProps={{
                tooltip: {
                    sx: {
                        backgroundColor: 'black',
                        color: 'white',
                        '& .MuiTypography-root': {
                            color: 'white',
                        },
                        '& .MuiTooltip-tooltip': {
                            backgroundColor: 'black',
                        },
                    },
                },
            }}
        />
    )
}

HighestRatedMoviesSection.propTypes = {
    userTopRatedMovies: PropTypes.objectOf(PropTypes.number).isRequired,
};
