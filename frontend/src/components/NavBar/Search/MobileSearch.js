import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import SearchStyle from "./Search.module.css";
import PropTypes from "prop-types";
import { ParseYear } from "../../IndFilm/MovieComponents";
import isTokenExpired from "../../../security/IsTokenExpired";
import { fetchData } from "../../../security/Data";

const searchEndpoint = process.env.REACT_APP_SEARCH_ENDPOINT;
const miniPosterUrl = process.env.REACT_APP_MINI_POSTER_URL;
const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const indMovieEndpoint = process.env.REACT_APP_IND_MOVIE_ENDPOINT

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
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            searchMovies(query);
        }, 500);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [query]);

    const searchMovies = async (searchQuery) => {
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
    };

    return (
        <form onSubmit={onSubmit} className={SearchStyle.Search} ref={searchRef}>
            <motion.div
                initial={{ width: 40 }}
                animate={{ width: expanded ? 160 : 40 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: "0.5px solid #ccc",
                    borderRadius: "30px",
                    padding: "5px 10px",
                    overflow: "hidden",
                }}
            >
                <button
                    type="button"
                    onClick={() => setExpanded(!expanded)}
                    style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        marginRight: expanded ? "10px" : "0px",
                    }}
                >
                    <Search size={20} color={expanded ? "gray" : "#0096ff"} />
                </button>
                {expanded && (
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            border: "none",
                            outline: "none",
                            fontSize: "0.9em",
                            flex: 1,
                            minWidth: 0,
                        }}
                    />
                )}
            </motion.div>

            {/* Search Results List */}
            <div className={SearchStyle["search-results-list"]}>
                {movieResults.map((movie) => {
                    if (movie.poster_path && movie.vote_average) {
                        return (
                            <a
                                href={`${indMovieEndpoint}${movie.id}`}
                                key={movie.id}
                                onClick={() => setMovieResults([])}
                            >
                                <li className={SearchStyle["ind-search-result"]}>
                                    <img
                                        src={`${miniPosterUrl}${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <div className={SearchStyle["result-title-data"]}>
                                        <div className={SearchStyle["result-title"]}>
                                            {movie.title}
                                            <div className={SearchStyle["result-release-date"]}>
                                                <span>({<ParseYear date={movie.release_date} />})</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={SearchStyle["result-rating"]}>
                                        {movie.vote_average}
                                    </div>
                                </li>
                            </a>
                        );
                    }
                })}
            </div>
        </form>
    );
}

MobileSearchBar.propTypes = {
    onSubmit: PropTypes.func,
    movieResults: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            title: PropTypes.string,
            poster_path: PropTypes.string,
            vote_average: PropTypes.number,
            release_date: PropTypes.string,
        })
    ),
    setMovieResults: PropTypes.func,
    miniPosterUrl: PropTypes.string,
};