import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    TextField,
    Button,
    Popover,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Select,
    InputLabel,
    FormControl,
    Box,
    // Grid,
    // Typography,
    // Slider,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { Autocomplete } from "@mui/material";
import ISO3166 from 'iso-3166-1'
const languageMap = {
    "af": "Afrikaans",
    "sq": "Albanian",
    "ar-dz": "Arabic (Algeria)",
    "ar-bh": "Arabic (Bahrain)",
    "ar-eg": "Arabic (Egypt)",
    "ar-iq": "Arabic (Iraq)",
    "ar-jo": "Arabic (Jordan)",
    "ar-kw": "Arabic (Kuwait)",
    "ar-lb": "Arabic (Lebanon)",
    "ar-ly": "Arabic (Libya)",
    "ar-ma": "Arabic (Morocco)",
    "ar-om": "Arabic (Oman)",
    "ar-qa": "Arabic (Qatar)",
    "ar-sa": "Arabic (Saudi Arabia)",
    "ar-sy": "Arabic (Syria)",
    "ar-tn": "Arabic (Tunisia)",
    "ar-ae": "Arabic (U.A.E.)",
    "ar-ye": "Arabic (Yemen)",
    "eu": "Basque",
    "be": "Belarusian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "zh-hk": "Chinese (Hong Kong)",
    "zh-cn": "Chinese (PRC)",
    "zh-sg": "Chinese (Singapore)",
    "zh-tw": "Chinese (Taiwan)",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl-be": "Dutch (Belgium)",
    "nl": "Dutch (Standard)",
    "en": "English",
    "en-au": "English (Australia)",
    "en-bz": "English (Belize)",
    "en-ca": "English (Canada)",
    "en-ie": "English (Ireland)",
    "en-jm": "English (Jamaica)",
    "en-nz": "English (New Zealand)",
    "en-za": "English (South Africa)",
    "en-tt": "English (Trinidad)",
    "en-gb": "English (United Kingdom)",
    "en-us": "English (United States)",
    "et": "Estonian",
    "fo": "Faeroese",
    "fa": "Farsi",
    "fi": "Finnish",
    "fr-be": "French (Belgium)",
    "fr-ca": "French (Canada)",
    "fr-lu": "French (Luxembourg)",
    "fr": "French (Standard)",
    "fr-ch": "French (Switzerland)",
    "gd": "Gaelic (Scotland)",
    "de-at": "German (Austria)",
    "de-li": "German (Liechtenstein)",
    "de-lu": "German (Luxembourg)",
    "de": "German (Standard)",
    "de-ch": "German (Switzerland)",
    "el": "Greek",
    "he": "Hebrew",
    "hi": "Hindi",
    "hu": "Hungarian",
    "is": "Icelandic",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian (Standard)",
    "it-ch": "Italian (Switzerland)",
    "ja": "Japanese",
    "ko": "Korean",
    "ku": "Kurdish",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "mk": "Macedonian (FYROM)",
    "ml": "Malayalam",
    "ms": "Malaysian",
    "mt": "Maltese",
    "no": "Norwegian",
    "nb": "Norwegian (Bokmål)",
    "nn": "Norwegian (Nynorsk)",
    "pl": "Polish",
    "pt-br": "Portuguese (Brazil)",
    "pt": "Portuguese (Portugal)",
    "pa": "Punjabi",
    "rm": "Rhaeto-Romanic",
    "ro": "Romanian",
    "ro-md": "Romanian (Republic of Moldova)",
    "ru": "Russian",
    "ru-md": "Russian (Republic of Moldova)",
    "sr": "Serbian",
    "sk": "Slovak",
    "sl": "Slovenian",
    "sb": "Sorbian",
    "es-ar": "Spanish (Argentina)",
    "es-bo": "Spanish (Bolivia)",
    "es-cl": "Spanish (Chile)",
    "es-co": "Spanish (Colombia)",
    "es-cr": "Spanish (Costa Rica)",
    "es-do": "Spanish (Dominican Republic)",
    "es-ec": "Spanish (Ecuador)",
    "es-sv": "Spanish (El Salvador)",
    "es-gt": "Spanish (Guatemala)",
    "es-hn": "Spanish (Honduras)",
    "es-mx": "Spanish (Mexico)",
    "es-ni": "Spanish (Nicaragua)",
    "es-pa": "Spanish (Panama)",
    "es-py": "Spanish (Paraguay)",
    "es-pe": "Spanish (Peru)",
    "es-pr": "Spanish (Puerto Rico)",
    "es": "Spanish (Spain)",
    "es-uy": "Spanish (Uruguay)",
    "es-ve": "Spanish (Venezuela)",
    "sv": "Swedish",
    "sv-fi": "Swedish (Finland)",
    "th": "Thai",
    "ts": "Tsonga",
    "tn": "Tswana",
    "tr": "Turkish",
    "ua": "Ukrainian",
    "ur": "Urdu",
    "ve": "Venda",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "ji": "Yiddish",
    "zu": "Zulu",
};

const languageOptions = Object.entries(languageMap).map(([code, name]) => ({
    label: name,
    value: code,
}));

const allFilters = [
    { label: "Certification", key: "certification", type: "string" },
    { label: "Min Certification", key: "certification.gte", type: "string" },
    { label: "Max Certification", key: "certification.lte", type: "string" },
    { label: "Certification Country", key: "certification_country", type: "string" },
    { label: "Include Adult Content", key: "include_adult", type: "boolean" },
    { label: "Include Videos", key: "include_video", type: "boolean" },
    { label: "Language", key: "language", type: "string" },
    { label: "Page", key: "page", type: "int" },
    { label: "Primary Release Year", key: "primary_release_year", type: "int" },
    { label: "Primary Release Date From", key: "primary_release_date.gte", type: "date" },
    { label: "Primary Release Date To", key: "primary_release_date.lte", type: "date" },
    { label: "Region", key: "region", type: "string" },
    { label: "Release Date From", key: "release_date.gte", type: "date" },
    { label: "Release Date To", key: "release_date.lte", type: "date" },
    { label: "Sort By", key: "sort_by", type: "select", options: ["popularity.desc", "release_date.desc", "vote_average.desc"] },
    { label: "Min Vote Average", key: "vote_average.gte", type: "float" },
    { label: "Max Vote Average", key: "vote_average.lte", type: "float" },
    { label: "Min Vote Count", key: "vote_count.gte", type: "int" },
    { label: "Max Vote Count", key: "vote_count.lte", type: "int" },
    { label: "Watch Region", key: "watch_region", type: "string" },
    { label: "With Cast", key: "with_cast", type: "string" },
    { label: "With Companies", key: "with_companies", type: "string" },
    { label: "With Crew", key: "with_crew", type: "string" },
    { label: "With Genres", key: "with_genres", type: "string" },
    { label: "With Keywords", key: "with_keywords", type: "string" },
    { label: "With Origin Country", key: "with_origin_country", type: "string" },
    { label: "With Original Language", key: "with_original_language", type: "string" },
    { label: "With People", key: "with_people", type: "string" },
    { label: "With Release Type", key: "with_release_type", type: "string" },
    { label: "Min Runtime (min)", key: "with_runtime.gte", type: "int" },
    { label: "Max Runtime (min)", key: "with_runtime.lte", type: "int" },
    { label: "Monetization Types", key: "with_watch_monetization_types", type: "string" },
    { label: "Watch Providers", key: "with_watch_providers", type: "string" },
    { label: "Exclude Companies", key: "without_companies", type: "string" },
    { label: "Exclude Genres", key: "without_genres", type: "string" },
    { label: "Exclude Keywords", key: "without_keywords", type: "string" },
    { label: "Exclude Watch Providers", key: "without_watch_providers", type: "string" },
    { label: "Year", key: "year", type: "int" },
];
const regionOptions = ISO3166.all().map((country) => ({
    code: country.alpha2,
    label: country.name,
}));
export default function DiscoverSearch() {
    const [query, setQuery] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filters, setFilters] = useState({});

    const openPopover = (event, filterKey) => {
        setAnchorEl(event.currentTarget);
        setActiveFilter(filterKey);
    };

    const closePopover = () => {
        setAnchorEl(null);
        setActiveFilter(null);
    };

    const handleChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const renderField = (filter) => {
        if (filter.key.includes("language")) {
            return (
                <Autocomplete
                    options={languageOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    filterOptions={(options, state) =>
                        options.filter((opt) =>
                            opt.label.toLowerCase().includes(state.inputValue.toLowerCase())
                        )
                    }
                    value={
                        languageOptions.find((opt) => opt.value === filters[filter.key]) || null
                    }
                    onChange={(e, newVal) =>
                        handleChange(filter.key, newVal ? newVal.value : "")
                    }
                    renderInput={(params) => (
                        <TextField {...params} label={filter.label} fullWidth />
                    )}
                />
            );
        } else if (filter.key.includes("region")) {
            const selectedRegion = regionOptions.find(
                (region) => region.code === filters[filter.key]
            ) || null;

            return (
                <Autocomplete
                    options={regionOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    value={selectedRegion}
                    onChange={(event, newValue) => {
                        handleChange(filter.key, newValue?.code || "");
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Region" variant="outlined" />
                    )}
                />
            );
        }

        switch (filter.type) {
            case "boolean":
                return (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!!filters[filter.key]}
                                onChange={(e) => handleChange(filter.key, e.target.checked)}
                            />
                        }
                        label={filter.label}
                    />
                );
            case "select":
                return (
                    <FormControl fullWidth>
                        <InputLabel>{filter.label}</InputLabel>
                        <Select
                            value={filters[filter.key] || ""}
                            onChange={(e) => handleChange(filter.key, e.target.value)}
                            label={filter.label}
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
                        value={filters[filter.key] ? dayjs(filters[filter.key]) : null}
                        onChange={(newVal) => handleChange(filter.key, newVal ? newVal.toISOString() : null)}
                    />
                );
            case "int":
            case "float":
            case "string":
            default:
                return (
                    <TextField
                        fullWidth
                        label={filter.label}
                        value={filters[filter.key] || ""}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                    />
                );
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                background: "linear-gradient(#141e30, #0096ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "2rem",
                color: "white",
            }}
        >
            <TextField
                variant="outlined"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                    width: "100%",
                    maxWidth: "500px",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    input: { fontSize: "1.1em" },
                }}
            />

            <Box
                sx={{
                    marginTop: "2rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    justifyContent: "center",
                }}
            >
                {allFilters.map((filter) => {
                    const isActive = filters[filter.key] !== undefined && filters[filter.key] !== "" && filters[filter.key] !== null;

                    return (
                        <Box key={filter.key} sx={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                            <Button
                                variant="contained"
                                onClick={(e) => openPopover(e, filter.key)}
                                sx={{
                                    backgroundColor: isActive ? "rgba(0, 150, 255, 0.4)" : "rgba(255, 255, 255, 0.1)",
                                    color: "#ffffff",
                                    backdropFilter: "blur(8px)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderRadius: "12px",
                                    fontSize: "0.8rem",
                                    padding: "6px 10px",
                                    pr: isActive ? "26px" : "10px", // extra space for the X
                                    transition: "all 0.3s ease",
                                    '&:hover': {
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    },
                                }}
                            >
                                {filter.label}
                            </Button>

                            {isActive && (
                                <Box
                                    onClick={() => handleChange(filter.key, "")}
                                    sx={{
                                        position: "absolute",
                                        right: 4,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        backgroundColor: "#ff4444",
                                        color: "white",
                                        fontSize: "0.8rem",
                                        lineHeight: 1,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        '&:hover': {
                                            backgroundColor: "#cc0000",
                                        },
                                    }}
                                >
                                    ×
                                </Box>
                            )}
                        </Box>
                    );
                })}
                <Button
                    onClick={() => setFilters({})}
                    variant="outlined"
                    sx={{
                        position: "absolute",
                        bottom: "2rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "#FFDEAD",
                        borderColor: "#FFDEAD",
                        fontWeight: "bold",
                        textTransform: "none",
                        padding: "6px 18px",
                        '&:hover': {
                            backgroundColor: "rgba(255, 222, 173, 0.1)",
                            borderColor: "#FFDEAD",
                        }
                    }}
                >
                    Clear All Filters
                </Button>
            </Box>
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={closePopover}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{ sx: { padding: 2, minWidth: "250px" } }}
            >
                {activeFilter && renderField(allFilters.find(f => f.key === activeFilter))}
            </Popover>
        </Box>
    );
}

DiscoverSearch.propTypes = {
    onSubmit: PropTypes.func,
};
