import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MovieCard from "../MovieCard/MovieCard";
import MovieListStyle from "../MovieList/MovieList.module.css"
import { Pagination } from "@mui/material";
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT

const theme = createTheme({
    palette: {
        primary: {
            main: "#0096ff",
        },
    },
});

export default function DiscoverResults({ movies, currentPage, onPageChange }) {

    return (
        <div>
            <div className={`${MovieListStyle.Container} ${MovieListStyle.DiscoverContainer}`}>
                {movies?.length > 0 ? (
                    movies.map((movie, index) => (
                        <div key={movie.id || index}>
                            <Link to={`${indMovieEndpoint}${movie.movieId}`}>
                                <MovieCard {...movie} />
                            </Link>
                        </div>
                    ))
                ) : (
                    <div>No results found</div>
                )}
            </div>
            {movies?.length > 0 ? (
                <div className={MovieListStyle["pagination-container"]}>
                    <ThemeProvider theme={theme}>
                        <Pagination
                            onChange={(_, value) => onPageChange(value)}
                            count={100}
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
            ) : null}
        </div>
    );
}
DiscoverResults.propTypes = {
    movies: PropTypes.array.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};