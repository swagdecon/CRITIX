import React, { useState } from 'react'
import NavBar from '../components/NavBar/NavBar'
import DiscoverSearch from '../components/Discover/DiscoverSearch'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import DiscoverResults from '../components/Discover/DiscoverResults';
import { fetchData } from '../security/Data';
const API_URL = process.env.REACT_APP_BACKEND_API_URL
const DISCOVER_MOVIES_ENDPOINT = process.env.REACT_APP_GET_DISCOVER_MOVIES

function buildQueryString(filters, page = 1) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value == null || value === "") return;

        if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item));
        } else {
            params.append(key, value);
        }
    });

    params.set("page", page.toString());
    return params.toString();
}

export default function DiscoverMovies() {
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});

    const fetchMovies = async (newFilters = filters, page = 1) => {
        if (newFilters) setFilters(newFilters);
        const queryString = buildQueryString(newFilters, page);
        const url = `${API_URL}${DISCOVER_MOVIES_ENDPOINT}?${queryString}`;
        try {
            const response = await fetchData(url);
            setMovies(response);
            setTotalPages(response.total_pages || 1);
            setCurrentPage(page);
        } catch (error) {
            console.error("Error fetching results:", error);
        }
    };

    return (
        <>
            <NavBar />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DiscoverSearch onSubmit={(filters) => fetchMovies(filters)} />
                <DiscoverResults
                    movies={movies}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => fetchMovies(undefined, page)}
                />
            </LocalizationProvider>
        </>
    );
}
