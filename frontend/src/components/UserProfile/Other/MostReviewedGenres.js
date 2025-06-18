import React from "react";
import { RadarChart } from '@mui/x-charts';
import PropTypes from "prop-types";

export default function MostReviewedGenres({ reviewedGenres }) {
    if (!reviewedGenres) {
        return <div>No data to display</div>;
    }

    const sortedGenres = Object.entries(reviewedGenres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

    if (sortedGenres.length < 3) {
        return <div>Not enough data to display chart</div>;
    }

    const maxCount = Math.max(...sortedGenres.map(([, count]) => count));

    const metrics = sortedGenres.map(([genre]) => ({
        name: genre.trim(),
        max: maxCount,
    }));

    const data = sortedGenres.map(([, count]) => count);

    return (
        <RadarChart
            height={300}
            series={[{ data }]}
            radar={{ metrics }}
        />
    );
}

MostReviewedGenres.propTypes = {
    reviewedGenres: PropTypes.objectOf(PropTypes.number).isRequired,
};
