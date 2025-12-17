import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import SearchStyle from "./Search.module.css";
import PropTypes from "prop-types";
import { ParseYear } from "../../IndFilm/MovieComponents";
import isTokenExpired from "../../../security/IsTokenExpired";
import { fetchData } from "../../../security/Data";

const searchEndpoint = process.env.REACT_APP_SEARCH_ENDPOINT;
const miniPosterUrl = process.env.REACT_APP_MINI_POSTER_URL;
const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT;

export default function MobileSearchBar({ onSubmit }) {
    const [query, setQuery] = useState("");
    const [movieResults, setMovieResults] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setExpanded(false);
                setMovieResults([]);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const searchMovies = useCallback(async (searchQuery) => {
        if (!searchQuery) {
            setMovieResults([]);
            return;
        }

        try {
            await isTokenExpired();
            const formattedQuery = searchQuery.includes(" ")
                ? searchQuery.trim().split(" ").join("+")
                : searchQuery.trim();
            const endpoint = `${API_URL}${searchEndpoint}${formattedQuery}`;

            const search = await fetchData(endpoint);
            setMovieResults(search || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            searchMovies(query);
        }, 500);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [query, searchMovies]);

    const handleClose = () => {
        setExpanded(false);
        setMovieResults([]);
        setQuery("");
    };

    return (
        <>
            {/* Backdrop overlay */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        className={SearchStyle.searchBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={handleClose}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Search Results */}
            <AnimatePresence>
                {expanded && movieResults.length > 0 && (
                    <motion.div
                        className={SearchStyle.mobileSearchResults}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {movieResults.map((movie) => {
                            if (movie.poster_path && movie.vote_average) {
                                return (
                                    <a
                                        href={`${indMovieEndpoint}${movie.id}`}
                                        key={movie.id}
                                        onClick={handleClose}
                                        className={SearchStyle.mobileResultLink}
                                    >
                                        <motion.div
                                            className={SearchStyle.mobileResultItem}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <img
                                                src={`${miniPosterUrl}${movie.poster_path}`}
                                                alt={movie.title}
                                                className={SearchStyle.mobileResultPoster}
                                            />
                                            <div className={SearchStyle.mobileResultInfo}>
                                                <div className={SearchStyle.mobileResultTitle}>
                                                    {movie.title}
                                                </div>
                                                <div className={SearchStyle.mobileResultYear}>
                                                    <ParseYear date={movie.release_date} />
                                                </div>
                                            </div>
                                            <div className={SearchStyle.mobileResultRating}>
                                                {movie.vote_average}
                                            </div>
                                        </motion.div>
                                    </a>
                                );
                            }
                            return null;
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            <form
                onSubmit={onSubmit}
                className={`${SearchStyle.mobileSearch} ${expanded ? SearchStyle.mobileSearchExpanded : ''}`}
                ref={searchRef}
            >
                <motion.div
                    className={SearchStyle.searchContainer}
                    initial={{ width: 40 }}
                    animate={{ width: expanded ? "100%" : 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className={SearchStyle.searchButton}
                    >
                        <Search
                            size={20}
                            className={SearchStyle.searchIcon}
                            strokeWidth={2.5}
                        />
                    </button>
                    {expanded && (
                        <>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className={SearchStyle.searchInput}
                                placeholder="Search movies..."
                                autoFocus
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className={SearchStyle.closeButton}
                                >
                                    <X size={18} className={SearchStyle.closeIcon} />
                                </button>
                            )}
                        </>
                    )}
                </motion.div>
            </form>
        </>
    );
}

MobileSearchBar.propTypes = {
    onSubmit: PropTypes.func,
};