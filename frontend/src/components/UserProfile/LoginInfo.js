import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart"
import { UserGraphStyle } from "../Shared/SharedMUI.js"
import PropTypes from 'prop-types';
import dayjs from "dayjs";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import UserStyle from "./UserProfile.module.css"

export function DropDown() {
    const [timePeriod, setTimePeriod] = useState(null);

    const handleChange = (e) => {
        setTimePeriod(e.target.value);
    };

    return (
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120, }}>
            <InputLabel id="demo-simple-select-filled-label" sx={{ color: "white" }}>Time Scale</InputLabel>
            <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={timePeriod}
                onChange={handleChange}
                sx={{ color: "white" }}
            >
                <MenuItem value={10}>Week</MenuItem>
                <MenuItem value={20}>Month</MenuItem>
                <MenuItem value={30}>Year</MenuItem>
            </Select>
        </FormControl>
    );
}

export default function LoginInfo({ data }) {
    let xAxisData = [];
    let seriesData = [];
    console.log(data)
    // Utility function to get all dates in the week for a given date
    function getWeekDates(date) {
        const startOfWeek = dayjs(date).startOf('week').add(1, 'day'); // Start of the week as Monday
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            weekDates.push(startOfWeek.add(i, 'day').toDate()); // Convert dayjs object to Date
        }
        return weekDates;
    }
    // Find the current week for the date in the data
    const sampleDate = new Date(Object.keys(data.weeklyLoginCounts)[0]);
    const weekDates = getWeekDates(sampleDate);

    // Populate xAxisData and seriesData
    weekDates.forEach(date => {
        const dateKey = dayjs(date).format('YYYY-MM-DD'); // Format to 'YYYY-MM-DD'
        xAxisData.push(date);
        seriesData.push(data.weeklyLoginCounts[dateKey] || 0); // Default to 0 if no data
    });

    return (
        <section className={UserStyle.ActivityInfo}>
            <h2 className={UserStyle.Title}>Activity</h2>
            <div className={UserStyle.DropdownWrapper}>
                <DropDown />
            </div>
            <LineChart
                xAxis={[
                    {
                        scaleType: 'band',
                        data: xAxisData,
                        valueFormatter: (date) => dayjs(date).format("dddd D"),
                    },
                ]}
                series={[
                    {
                        data: seriesData,
                        color: '#0096ff',
                    },
                ]}
                height={300}
                sx={UserGraphStyle}
            />
        </section >
    );
}

LoginInfo.propTypes = {
    data: PropTypes.obj
}