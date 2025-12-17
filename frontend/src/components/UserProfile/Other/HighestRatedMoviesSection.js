import React from 'react';
import { BarChart } from "@mui/x-charts";
import PropTypes from "prop-types";
import UserStyle from "../UserProfile.module.css"

export default function HighestRatedMoviesSection({ userTopRatedMovies }) {
    const movieNames = Object.keys(userTopRatedMovies);
    const ratings = Object.values(userTopRatedMovies);

    return (
        userTopRatedMovies > 0 ?
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
            /> : <div className={UserStyle.NoContent} >
                Start reviewing movies to gain insights here
            </div>

    )
}

HighestRatedMoviesSection.propTypes = {
    userTopRatedMovies: PropTypes.objectOf(PropTypes.number).isRequired,
};
