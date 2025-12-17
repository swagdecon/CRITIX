import React, { useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { UserGraphStyle } from "../Shared/SharedMUI.js";
import PropTypes from 'prop-types';
import dayjs from "dayjs";
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import UserStyle from "./UserProfile.module.css";

export function DropDown({ timePeriod, setTimePeriod }) {
    return (
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel sx={{ color: "white" }}>Time Scale</InputLabel>
            <Select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                sx={{ color: "white" }}
            >
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="year">Year</MenuItem>
            </Select>
        </FormControl>
    );
}

DropDown.propTypes = {
    timePeriod: PropTypes.string.isRequired,
    setTimePeriod: PropTypes.func.isRequired,
};

export default function LoginInfo({ data }) {
    const [timePeriod, setTimePeriod] = useState("week");

    const getWeekDates = (date) =>
        Array.from({ length: 7 }, (_, i) => dayjs(date).startOf('week').add(1, 'day').add(i, 'day').toDate());

    const generateXAxisData = () => {
        if (timePeriod === "week") {
            const weekDates = getWeekDates(new Date(Object.keys(data.weeklyLoginCounts)[0]));
            return weekDates.map(date => ({
                key: dayjs(date).format('YYYY-MM-DD'),
                label: dayjs(date).format("dddd D"),
                value: data.weeklyLoginCounts[dayjs(date).format('YYYY-MM-DD')] || 0
            }));
        } else if (timePeriod === "month") {
            const currentYear = dayjs().year();
            return Array.from({ length: 12 }, (_, i) => {
                const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
                return {
                    key: monthKey,
                    label: dayjs(`${monthKey}-01`).format("MMM YYYY"),
                    value: data.monthlyLoginCounts[monthKey] || 0
                };
            });
        } else if (timePeriod === "year") {
            const currentYear = dayjs().year();
            return [-1, 0, 1].map(offset => {
                const year = currentYear + offset;
                return {
                    key: year.toString(),
                    label: year.toString(),
                    value: data.yearlyLoginCounts[year] || 0
                };
            });
        }
    };

    const xAxisData = generateXAxisData();

    return (
        <section className={UserStyle.ActivityInfo}>
            <h2 className={UserStyle.Title}>Activity</h2>
            <div className={UserStyle.DropdownWrapper}>
                <DropDown timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
            </div>
            <LineChart
                xAxis={[
                    {
                        scaleType: 'band',
                        data: xAxisData.map(({ key }) => key),
                        valueFormatter: (key) => xAxisData.find(item => item.key === key)?.label,
                    },
                ]}
                series={[
                    {
                        data: xAxisData.map(({ value }) => value),
                        color: '#0096ff',
                    },
                ]}
                height={300}
                sx={UserGraphStyle}
            />
        </section>
    );
}

LoginInfo.propTypes = {
    data: PropTypes.object.isRequired,
};

