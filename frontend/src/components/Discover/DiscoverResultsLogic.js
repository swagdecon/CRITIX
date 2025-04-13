import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchData } from "../../security/Data";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MovieCard from "../MovieCard/MovieCard";
import MovieListStyle from "../MovieList/MovieList.module.css"
import { Pagination } from "@mui/material";
import LoadingPage from "../../views/Loading";

const API_URL = process.env.REACT_APP_BACKEND_API_URL
const DISCOVER_MOVIES_ENDPOINT = process.env.REACT_APP_GET_DISCOVER_MOVIES


const theme = createTheme({
    palette: {
        primary: {
            main: "#0096ff",
        },
    },
});

export default function DiscoverResultsLogic() {
    const { search } = useLocation();
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchMovies = async (page) => {
        let queryString = search.startsWith('?') ? search.slice(1) : search;

        const searchParams = new URLSearchParams(queryString);
        searchParams.set("page", page);
        queryString = searchParams.toString();

        const url = `${API_URL}${DISCOVER_MOVIES_ENDPOINT}?${queryString}`;
        try {
            const response = await fetchData(url);
            setMovies(response || []);
            setTotalPages(response.total_pages || 1);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    };


    useEffect(() => {
        const query = new URLSearchParams(search);
        const pageFromURL = parseInt(query.get("page"), 10) || 1;

        fetchMovies(pageFromURL);
    }, [search]);

    const handlePageChange = (_, value) => {
        fetchMovies(value);
    };
    if (movies) {
        return (
            <div>
                <div className={MovieListStyle.Container}>
                    {movies.map((movie) => {

                        return (
                            <div key={movie.id}>
                                <Link to={`/movies/movie/${movie.id}`}>
                                    <MovieCard {...movie} />
                                </Link>
                            </div>
                        );
                    })}
                </div>
                {totalPages > 1 && (
                    <div className={MovieListStyle["pagination-container"]}>
                        <ThemeProvider theme={theme}>
                            <Pagination
                                onChange={handlePageChange}
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
                )}
            </div>
        );
    } else {
        return <LoadingPage />
    }
}
