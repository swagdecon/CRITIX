import React from "react";

import { LineChart } from "@mui/x-charts/LineChart"
import { UserGraphStyle } from "../Shared/SharedMUI.js"
import PropTypes from 'prop-types';
import dayjs from "dayjs";



export default function LoginInfo({ data }) {
    let xAxisData = [];
    let seriesData = [];

    // Utility function to get all dates in the week for a given date
    function getWeekDates(date) {
        const startOfWeek = dayjs(date).startOf('week').add(1, 'day'); // Start of the week as Monday
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            weekDates.push(startOfWeek.add(i, 'day').toDate()); // Convert dayjs object to Date
        }
        return weekDates;
    }
    console.log(xAxisData);
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
            width={1000}
            height={300}
            sx={UserGraphStyle}
        />
    );
}

LoginInfo.propTypes = {
    data: PropTypes.obj
}