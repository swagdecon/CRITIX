import React, { useState, useCallback, Link } from "react";
import PropTypes from "prop-types";
import {
    TextField, Button, Popover, MenuItem, Checkbox, FormControlLabel,
    Select, InputLabel, FormControl, Box, Autocomplete,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import * as ISO3166 from 'iso-3166-1';
import { languageMap, gbCertifications, allFilters } from "./FilterDropdownOptions";
import { fetchData } from "../../security/Data"
import MovieListStyle from "../MovieList/MovieList.module.css"
import MovieCard from "../MovieCard/MovieCard";
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const API_URL = process.env.REACT_APP_BACKEND_API_URL
const DISCOVER_MOVIES_ENDPOINT = process.env.REACT_APP_GET_DISCOVER_MOVIES


const theme = createTheme({
    palette: {
        primary: {
            main: "#0096ff",
        },
    },
});

const languageOptions = Object.entries(languageMap).map(([code, name]) => ({
    label: name,
    value: code,
}));

const certificationOptions = [
    { group: "Specific", options: gbCertifications.map(cert => ({ label: cert, value: { type: "eq", cert } })) },
    { group: "Minimum", options: gbCertifications.map(cert => ({ label: `At least ${cert}`, value: { type: "gte", cert } })) },
    { group: "Maximum", options: gbCertifications.map(cert => ({ label: `Up to ${cert}`, value: { type: "lte", cert } })) },
];

const flatCertificationOptions = certificationOptions.flatMap(group => group.options);

const regionOptions = ISO3166.all().map(country => {
    const name = ISO3166.whereAlpha2(country.alpha2)?.country || country.alpha2;
    return {
        code: country.alpha2,
        label: `${name} (${country.alpha2})`,
    };
});

const buildQueryString = (filters, query, page) => {
    const queryParts = [];

    if (query) {
        queryParts.push(`with_keywords=${encodeURIComponent(query)}`);
    }

    Object.keys(filters).forEach((key) => {
        const value = filters[key];

        if (!value) return;

        if (Array.isArray(value)) {
            const filterValues = value.map((v) => {
                if (typeof v === "object") {
                    return "";
                }
                if (typeof v === 'string' && v.includes(',')) {
                    return v.split(',').map((val) => `${key}=${val.trim()}`).join('&');
                }
                if (typeof v === 'string' && v.includes('|')) {
                    return v.split('|').map((val) => `${key}=${val.trim()}`).join('&');
                }
                return `${key}=${v}`;
            }).filter(Boolean).join('&');
            queryParts.push(filterValues);
        } else if (typeof value !== "object") {
            queryParts.push(`${key}=${value}`);
        }
    });

    if (typeof page === "number" || typeof page === "string") {
        queryParts.push(`page=${page}`);
    }

    return queryParts.join('&');
};


export default function DiscoverSearch() {
    const [query, setQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filters, setFilters] = useState({});
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const openPopover = useCallback((event, key) => {
        setAnchorEl(event.currentTarget);
        setActiveFilter(key);
    }, []);

    const closePopover = useCallback(() => {
        setAnchorEl(null);
        setActiveFilter(null);
    }, []);

    const handleChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleSearch = async (page = 1) => {
        setCurrentPage(page);
        const queryString = buildQueryString(filters, query, page);
        const url = `${API_URL}${DISCOVER_MOVIES_ENDPOINT}?${queryString}`;
        console.log(url)
        try {
            const response = await fetchData(url);
            setMovies(response || []);
            console.log(movies)
            setTotalPages(response.total_pages || 1);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const handlePageChange = (_, value) => {
        handleSearch(value);
    };

    const renderField = useCallback((filter) => {
        const value = filters[filter.key];

        const commonTextField = (extraProps = {}) => (
            <TextField
                fullWidth
                label={filter.label}
                value={value || ""}
                onChange={(e) => handleChange(filter.key, e.target.value)}
                {...extraProps}
            />
        );

        if (filter.key.includes("language")) {
            return (
                <Autocomplete
                    options={languageOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(o, v) => o.value === v.value}
                    value={languageOptions.find(opt => opt.value === value) || null}
                    onChange={(_, newVal) => handleChange(filter.key, newVal ? newVal.value : "")}
                    renderInput={(params) => <TextField {...params} label={filter.label} fullWidth />}
                />
            );
        }

        if (["region", "with_origin_country", 'watch_region'].includes(filter.key)) {
            return (
                <Autocomplete
                    options={regionOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(o, v) => o.code === v.code}
                    value={regionOptions.find(opt => opt.code === value) || null}
                    onChange={(_, newVal) => handleChange(filter.key, newVal ? newVal.code : "")}
                    renderInput={(params) => <TextField {...params} label={filter.label} fullWidth />}
                />
            );
        }

        if (filter.key === "certification") {
            const selectedValues = value || [];
            const currentValues = flatCertificationOptions.filter(opt =>
                selectedValues.some(val => val.type === opt.value.type && val.cert === opt.value.cert)
            );

            return (
                <Autocomplete
                    multiple
                    options={flatCertificationOptions}
                    groupBy={(opt) => {
                        const match = certificationOptions.find(group =>
                            group.options.includes(opt)
                        );
                        return match?.group || "";
                    }}
                    getOptionLabel={(opt) => opt.label}
                    isOptionEqualToValue={(o, v) =>
                        o.value.type === v.value.type && o.value.cert === v.value.cert
                    }
                    value={currentValues}
                    onChange={(_, newVals) =>
                        handleChange(filter.key, newVals.map(val => val.value))
                    }
                    renderInput={(params) => <TextField {...params} label={filter.label} fullWidth />}
                />
            );
        }
        if (["with_genres", "without_genres"].includes(filter.key)) {
            return (
                <FormControl fullWidth>
                    <InputLabel>{filter.label}</InputLabel>
                    <Select
                        label={filter.label}
                        value={value || ""}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                    >
                        {filter.options.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }
        if (filter.key === "with_release_type") {
            return (
                <FormControl fullWidth>
                    <InputLabel>{filter.label}</InputLabel>
                    <Select
                        label={filter.label}
                        value={value || ""}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                    >
                        {filter.options.map((releaseType) => (
                            <MenuItem key={releaseType} value={releaseType}>
                                {releaseType}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }

        switch (filter.type) {
            case "boolean":
                return (
                    <FormControlLabel
                        control={<Checkbox checked={!!value} onChange={(e) => handleChange(filter.key, e.target.checked)} />}
                        label={filter.label}
                    />
                );
            case "select":
                return (
                    <FormControl fullWidth>
                        <InputLabel>{filter.label}</InputLabel>
                        <Select
                            label={filter.label}
                            value={value || ""}
                            onChange={(e) => handleChange(filter.key, e.target.value)}
                        >
                            {filter.options.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );
            case "date":
                return (
                    <DatePicker
                        label={filter.label}
                        value={value ? dayjs(value) : null}
                        onChange={(newVal) => handleChange(filter.key, newVal?.toISOString() || null)}
                    />
                );
            case "int": {
                const isRuntime = filter.key.includes("runtime");
                const isPage = filter.key === "page";

                return (
                    <TextField
                        fullWidth
                        label={filter.label}
                        type="number"
                        inputProps={{
                            min: isPage ? 1 : isRuntime ? 1 : undefined,
                            max: isPage ? 100 : isRuntime ? 500 : undefined,
                        }}
                        value={filters[filter.key] || ""}
                        onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                                if (isPage && (val < 1 || val > 100)) return;
                                if (isRuntime && (val < 1 || val > 500)) return;
                            }
                            handleChange(filter.key, e.target.value);
                        }}
                    />
                );
            }
            case "float": {
                return (
                    <FormControl fullWidth>
                        <InputLabel>{filter.label}</InputLabel>
                        <Select
                            label={filter.label}
                            value={filters[filter.key] ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleChange(filter.key, val === "" ? null : parseInt(val, 10));
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        maxHeight: "31vh"
                                    },
                                },
                            }}
                        >
                            {[...Array(100)].map((_, i) => {
                                const value = i + 1;
                                return (
                                    <MenuItem key={value} value={value}>
                                        {value} {value === 1 ? "kernel" : "kernels"}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                );
            }
            case "string":
                if (filter.key === "with_watch_monetization_types") {
                    const monetizationOptions = ["Flatrate", "Free", "Ads", "Rent", "Buy"];
                    return (
                        <FormControl fullWidth>
                            <InputLabel>{filter.label}</InputLabel>
                            <Select
                                value={value || ""}
                                onChange={(e) => handleChange(filter.key, e.target.value)}
                                label={filter.label}
                            >
                                {monetizationOptions.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                } else if (["with_watch_providers", "without_watch_providers"].includes(filter.key)) {
                    return (
                        <FormControl fullWidth>
                            <InputLabel>{filter.label}</InputLabel>
                            <Select
                                value={value || ""}
                                onChange={(e) => handleChange(filter.key, e.target.value)}
                                label={filter.label}
                            >
                                {filter.options.map(option => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                } else {
                    return commonTextField();
                }
            default:
                return commonTextField();

        }
    }, [filters, handleChange]);

    const clearAllFilters = useCallback(() => setFilters({}), []);
    if (movies.length === 0) {
        return (
            <Box sx={{ height: "100vh", background: "linear-gradient(#141e30, #0096ff)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, color: "white" }}>
                <TextField
                    variant="outlined"
                    placeholder="Search movies…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{
                        width: "100%",
                        maxWidth: "600px",
                        background: "linear-gradient(135deg, rgba(138,43,226,0.2), rgba(0,204,255,0.1))",
                        borderRadius: "16px",
                        backdropFilter: "blur(14px)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
                        input: {
                            color: "#fff",
                            padding: "14px 20px",
                            fontSize: "1.1rem",
                            fontWeight: 500,
                            letterSpacing: "0.5px",
                        },
                        fieldset: {
                            borderRadius: "16px",
                        },
                        "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": {
                                borderColor: "rgba(255,255,255,0.25)",
                            },
                            "&.Mui-focused fieldset": {
                                border: "2px solid #8A2BE2",
                                boxShadow: "0 0 8px #8A2BE2",
                            },
                        },
                        transition: "all 0.3s ease-in-out",
                    }}
                    InputProps={{
                        endAdornment: (
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                sx={{
                                    ml: 1,
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #00ccff, #8A2BE2)",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #00a3cc, #7a1fd2)",
                                    },
                                }}
                            >
                                Search
                            </Button>
                        ),
                    }} />
                <Box
                    sx={{
                        marginTop: "2rem",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "center",
                    }}
                ></Box>
                <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
                    {allFilters.map((filter) => {
                        const isActive = filters[filter.key] !== undefined && filters[filter.key] !== "" && filters[filter.key] !== null;
                        return (
                            <Box
                                key={filter.key}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    bgcolor: isActive ? "rgba(0,150,255,0.2)" : "rgba(255,255,255,0.1)",
                                    borderRadius: 2,
                                    pl: 1,
                                    pr: 0.5,
                                    py: 0.5,
                                }}
                            >
                                <Button
                                    onClick={(e) => openPopover(e, filter.key)}
                                    sx={{
                                        color: "#fff",
                                        fontWeight: "bold",
                                        textTransform: "none",
                                        p: 0,
                                        minWidth: 0,
                                        mr: 1,
                                    }}
                                >
                                    {filter.label}
                                </Button>
                                {isActive && (
                                    <Box
                                        onClick={() => handleChange(filter.key, "")}
                                        sx={{
                                            cursor: "pointer",
                                            color: "#fff",
                                            backgroundColor: "#f44",
                                            borderRadius: "50%",
                                            width: 20,
                                            height: 20,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "0.8rem",
                                            fontWeight: "bold",
                                            lineHeight: 1,
                                        }}
                                    >
                                        ×
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                    <Button onClick={clearAllFilters} variant="outlined" sx={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)" }}>
                        Clear All Filters
                    </Button>
                </Box>

                <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={closePopover}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                    PaperProps={{ sx: { p: 2, minWidth: 250 } }}
                >
                    {activeFilter && renderField(allFilters.find(f => f.key === activeFilter))}
                </Popover>
            </Box>

        );
    } else {
        return (
            <Box sx={{ mt: 6, width: "100%", maxWidth: "1200px" }}>
                <div className={MovieListStyle.Container}>
                    {movies.map((movie) => (
                        <div key={movie.movieId}>
                            <Link to={`/movies/movie/${movie.movieId}`}>
                                <MovieCard
                                    movieId={movie.movieId}
                                    posterUrl={movie.posterUrl}
                                    voteAverage={movie.voteAverage}
                                    runtime={movie.runtime}
                                    genres={movie.genres}
                                    overview={movie.overview}
                                    actors={movie.actors}
                                    video={movie.video}
                                    isSavedToFavouriteMoviesList={movie.isSavedToFavouriteMoviesList}
                                    isSavedToWatchlist={movie.isSavedToWatchlist}
                                />
                            </Link>
                        </div>
                    ))}
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
            </Box>
        )
    }
}

DiscoverSearch.propTypes = {
    onSubmit: PropTypes.func,
};
