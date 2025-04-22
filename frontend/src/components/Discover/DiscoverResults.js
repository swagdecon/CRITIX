import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MovieCard from "../MovieCard/MovieCard";
import MovieListStyle from "../MovieList/MovieList.module.css"
import { Pagination } from "@mui/material";
// import LoadingPage from "../../views/Loading";

const theme = createTheme({
    palette: {
        primary: {
            main: "#0096ff",
        },
    },
});

export default function DiscoverResults({ movies, totalPages, currentPage, onPageChange }) {
    console.log("Total Pages:", totalPages);

    return (
        <div>
            <div className={`${MovieListStyle.Container} ${MovieListStyle.DiscoverContainer}`}>
                {movies?.length > 0 ? (
                    movies.map((movie, index) => (
                        <div key={movie.id || index}>
                            <Link to={`/movies/movie/${movie.movieId}`}>
                                <MovieCard {...movie} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div>No results found</div>
                )}
            </div>
            <div className={MovieListStyle["pagination-container"]}>
                <ThemeProvider theme={theme}>
                    <Pagination
                        onChange={(_, value) => onPageChange(value)}
                        count={totalPages}
                        siblingCount={4}
                        boundaryCount={1}
                        page={currentPage}
                        size="large"
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#ffffff',
                            },
                        }}
                    />
                </ThemeProvider>
            </div>
        </div>
    );
}
DiscoverResults.propTypes = {
    movies: PropTypes.array.isRequired,
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};