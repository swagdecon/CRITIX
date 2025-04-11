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
import * as ISO3166 from 'iso-3166-1';
import { languageMap, gbCertifications, allFilters } from "./FilterDropdownOptions";

const languageOptions = Object.entries(languageMap).map(([code, name]) => ({
    label: name,
    value: code,
}));


const certificationOptions = [
    {
        group: "Specific",
        options: gbCertifications.map(cert => ({
            label: cert,
            value: { type: "eq", cert }
        }))
    },
    {
        group: "Minimum",
        options: gbCertifications.map(cert => ({
            label: `At least ${cert}`,
            value: { type: "gte", cert }
        }))
    },
    {
        group: "Maximum",
        options: gbCertifications.map(cert => ({
            label: `Up to ${cert}`,
            value: { type: "lte", cert }
        }))
    }
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
                    value={languageOptions.find(opt => opt.value === filters[filter.key]) || null}
                    onChange={(e, newVal) =>
                        handleChange(filter.key, newVal ? newVal.value : "")
                    }
                    renderInput={(params) => (
                        <TextField {...params} label={filter.label} fullWidth />
                    )}
                />
            );
        } else if (
            filter.key === "region" || filter.key === "with_origin_country"
        ) {
            return (
                <Autocomplete
                    options={regionOptions}
                    getOptionLabel={(option) => {
                        if (typeof option === "string") return option;
                        if (option && typeof option === "object") {
                            return option.label || option.code || "";
                        }
                        return "";
                    }} isOptionEqualToValue={(option, value) => option.code === value.code}
                    value={regionOptions.find(opt => opt.code === filters[filter.key]) || null}
                    onChange={(e, newVal) =>
                        handleChange(filter.key, newVal ? newVal.code : "")
                    }
                    renderInput={(params) => (
                        <TextField {...params} label={filter.label} fullWidth />
                    )}
                />
            );
        } else if (filter.key === "certification") {
            const flatOptions = certificationOptions.flatMap(group => group.options);
            const selectedValues = filters[filter.key] || [];
            const currentValues = flatOptions.filter(option =>
                selectedValues.some(
                    val =>
                        val.type === option.value.type &&
                        val.cert === option.value.cert
                )
            );
            return (
                <Autocomplete
                    multiple
                    options={flatOptions}
                    groupBy={(option) => {
                        const match = certificationOptions.find(group =>
                            group.options.includes(option)
                        );
                        return match?.group || "";
                    }}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) =>
                        option.value.type === value.value.type && option.value.cert === value.value.cert
                    }
                    value={currentValues}
                    onChange={(e, newVals) =>
                        handleChange(
                            filter.key,
                            newVals.map((val) => val.value)
                        )
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
            case "int": {
                const isRuntime =
                    filter.key === "with_runtime.gte" || filter.key === "with_runtime.lte";
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
            case "float":
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
            case "string":
                if (filter.key === "with_watch_providers") {
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
                } else {
                    return (
                        <TextField
                            fullWidth
                            label={filter.label}
                            value={filters[filter.key] || ""}
                            onChange={(e) => handleChange(filter.key, e.target.value)}
                        />
                    );
                }
        }
    }

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
