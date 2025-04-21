import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
    TextField, Button, Popover, MenuItem, Checkbox, FormControlLabel,
    Select, InputLabel, FormControl, Box, Autocomplete,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import * as ISO3166 from 'iso-3166-1';
import { languageMap, gbCertifications, allFilters } from "./FilterDropdownOptions";


const languageOptions = Object.entries(languageMap).map(([value, label]) => ({
    value,
    label,
}));


const certificationOptions = [
    {
        group: "Certification",
        options: gbCertifications.map(cert => ({
            label: cert,
            value: { type: "eq", cert },
        })),
    },
];

const flatCertificationOptions = certificationOptions.flatMap(group => group.options);

const regionOptions = ISO3166.all().map(country => {
    const name = ISO3166.whereAlpha2(country.alpha2)?.country || country.alpha2;
    return {
        code: country.alpha2,
        label: `${name} (${country.alpha2})`,
    };
});

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


export default function DiscoverSearch() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filters, setFilters] = useState({ includeAdult: false });
    const navigate = useNavigate();

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

    const handleSearch = async () => {
        const { page, ...rest } = filters;
        const pageNumber = Number(page);

        if (
            (rest.withWatchProviders || rest.withWatchMonetizationTypes || rest.withoutWatchProviders) &&
            !rest.watchRegion
        ) {
            rest.watchRegion = "GB";
        }

        const queryString = buildQueryString(rest, isNaN(pageNumber) ? 1 : pageNumber);
        navigate(`/discover/results?${queryString}`);
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
                placeholder="e.g. Tom Hanks, Meg Ryan"
            />
        );


        if (filter.key.includes("withOriginalLanguage")) {
            return (
                <Autocomplete
                    options={languageOptions}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(o, v) => o.value === v.value}
                    value={languageOptions.find(opt => opt.value === value) || null}
                    onChange={(_, newVal) => handleChange(filter.key, newVal ? newVal.value : "")}
                    renderInput={(params) => (
                        <TextField {...params} label={filter.label} fullWidth />
                    )}
                />
            );
        }

        if (["region", "withOriginCountry", 'watchRegion'].includes(filter.key)) {
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
                selectedValues.includes(opt.value.cert)
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
                        handleChange(filter.key, newVals.map(val => val.value.cert).join(','))
                    }
                    renderInput={(params) => <TextField {...params} label={filter.label} fullWidth />}
                />
            );
        }
        if (["withGenres", "withoutGenres"].includes(filter.key)) {
            const selectedGenreValues = (value || "").split(",").map((val) => parseInt(val, 10));
            const selectedGenres = filter.options.filter((opt) => selectedGenreValues.includes(opt.value));

            return (
                <Autocomplete
                    multiple
                    options={filter.options}
                    getOptionLabel={(option) => option.label}
                    value={selectedGenres}
                    onChange={(_, newVals) => handleChange(filter.key, newVals.map((val) => val.value).join(","))}
                    renderInput={(params) => <TextField {...params} label={filter.label} fullWidth />}
                />
            );
        }
        if (filter.key === "primaryReleaseYear") {
            return (
                <DatePicker
                    views={["year"]}
                    label={filter.label}
                    value={value ? dayjs(`${value}`) : null}
                    onChange={(newVal) => {
                        const year = newVal ? dayjs(newVal).year() : null;
                        handleChange(filter.key, year);
                    }}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                        }
                    }}
                />
            );
        }
        if (filter.key === "withReleaseType") {
            const selectedReleaseValues = typeof value === "string"
                ? value.split(",").map((v) => v.trim()).filter(Boolean)
                : [];

            const selectedReleases = filter.options.filter((opt) =>
                selectedReleaseValues.includes(opt.value)
            );

            return (
                <Autocomplete
                    multiple
                    options={filter.options}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
                    value={selectedReleases}
                    onChange={(_, newVals) =>
                        handleChange(filter.key, newVals.map((val) => val.value).join(","))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label={filter.label} fullWidth />
                    )}
                />
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
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                );

            case "date":
                return (
                    <DatePicker
                        label={filter.label}
                        value={value ? dayjs(value) : null}
                        onChange={(newVal) => handleChange(filter.key, newVal ? dayjs(newVal).format("YYYY-MM-DD") : null)}
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
                if (filter.key === "withWatchMonetizationTypes") {
                    const monetizationOptions = ["flatrate", "free", "ads", "rent", "buy"];
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
                } else if (["withWatchProviders", "withoutWatchProviders"].includes(filter.key)) {
                    const getSelectedOptions = (options, value) =>
                        Array.isArray(options)
                            ? options.filter(opt => (value || "").split(',').includes(opt.value))
                            : [];
                    return (
                        <FormControl fullWidth>
                            <InputLabel>{filter.label}</InputLabel>
                            <Autocomplete
                                multiple
                                options={filter.options}
                                getOptionLabel={(option) => option.label}
                                isOptionEqualToValue={(o, v) => o.value === v.value}
                                value={getSelectedOptions(filter.options, value)}
                                onChange={(_, newVals) =>
                                    handleChange(filter.key, newVals.map(val => val.value).join(','))
                                }
                                renderInput={(params) => <TextField {...params} label={filter.label} fullWidth />}
                            />
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
    return (
        <Box sx={{ height: "100vh", background: "linear-gradient(#141e30, #0096ff)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4, color: "white" }}>
            <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.2rem",
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
                    const isActive = (
                        filter.key === "includeAdult"
                            ? filters[filter.key] === true
                            : filters[filter.key] !== undefined && filters[filter.key] !== "" && filters[filter.key] !== null);
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
}

DiscoverSearch.propTypes = {
    onSubmit: PropTypes.func,
};
