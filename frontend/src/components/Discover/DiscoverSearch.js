import React, { useState, useRef, useCallback, useMemo } from "react";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import {
    TextField, Button, Popover, MenuItem, Checkbox, FormControlLabel,
    Select, InputLabel, FormControl, Box, Autocomplete,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import * as ISO3166 from 'iso-3166-1';
import { languageMap, gbCertifications, allFilters } from "./FilterDropdownOptions";
import CookieManager from "../../security/CookieManager.js";
import { jwtDecode } from "jwt-decode";

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
const getUserCountry = () => {
    const lang = navigator.language || "en-GB";
    const country = lang.split("-")[1];
    return country || "GB";
};


export default function DiscoverSearch({ onSubmit }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [filters, setFilters] = useState({ includeAdult: false });
    const token = useMemo(() => CookieManager.decryptCookie("accessToken"), []);
    const decodedToken = useMemo(() => jwtDecode(token), [token]);
    const isUltimateUser = decodedToken.isUltimateUser

    const debouncedSearch = useRef(debounce((updatedFilters) => {
        const { page, ...rest } = updatedFilters;
        const pageNumber = Number(page);
        const userCountry = getUserCountry();

        if (
            (rest.withWatchProviders || rest.withWatchMonetizationTypes || rest.withoutWatchProvider) &&
            !rest.watchRegion
        ) {
            rest.watchRegion = userCountry;
        }

        if (!rest.certificationCountry) {
            rest.certificationCountry = userCountry;
        }

        onSubmit({ ...rest }, isNaN(pageNumber) ? 1 : pageNumber);
    }, 500)).current;

    const openPopover = useCallback((event, key) => {
        setAnchorEl(event.currentTarget);
        setActiveFilter(key);
    }, []);

    const closePopover = useCallback(() => {
        setAnchorEl(null);
        setActiveFilter(null);
    }, []);

    const handleChange = useCallback((key, value) => {
        setFilters(prev => {
            const updatedFilters = { ...prev, [key]: value };
            debouncedSearch(updatedFilters);
            return updatedFilters;
        });
    }, []);

    const handleSearch = useCallback((updatedFilters = filters) => {
        const { page, ...rest } = updatedFilters;
        const pageNumber = Number(page);
        const userCountry = getUserCountry();

        if (
            (rest.withWatchProviders || rest.withWatchMonetizationTypes || rest.withoutWatchProvider) &&
            !rest.watchRegion
        ) {
            rest.watchRegion = userCountry;
        }

        if (!rest.certificationCountry) {
            rest.certificationCountry = userCountry;
        }

        onSubmit({ ...rest }, isNaN(pageNumber) ? 1 : pageNumber);
    }, [filters, onSubmit]);

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

        if (["region", "withOriginCountry", 'watchRegion', 'certificationCountry'].includes(filter.key)) {
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
                if (filter.key === "voteAverageGte" || filter.key === "voteAverageLte") {
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
                } else {
                    return (
                        <TextField
                            fullWidth
                            label={filter.label}
                            type="number"
                            value={filters[filter.key] || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                const parsed = val === "" ? null : parseFloat(val);
                                handleChange(filter.key, parsed);
                            }}
                        />
                    );
                }
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
                        <Autocomplete
                            multiple
                            options={filter.options}
                            getOptionLabel={(option) => option.label}
                            isOptionEqualToValue={(o, v) => o.value === v.value}
                            value={getSelectedOptions(filter.options, value)}
                            onChange={(_, newVals) =>
                                handleChange(filter.key, newVals.map(val => val.value).join(','))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={filter.label}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    sx={{
                                        "& .MuiInputBase-root": {
                                            height: 40,
                                        },
                                        "& .MuiInputLabel-root": {
                                            top: -6,
                                        },
                                    }}
                                />
                            )}
                        />
                    );
                } else {
                    return commonTextField();
                }

            default:
                return commonTextField();

        }
    }, [filters, handleChange]);

    const clearAllFilters = useCallback(() => {
        const resetFilters = { includeAdult: false };
        setFilters(resetFilters);
        handleSearch(resetFilters);
    }, [handleSearch]);
    return (
        <Box sx={{
            minHeight: "35vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            px: 4,
            color: "white",
        }}>
            <Box
                sx={{
                    marginTop: "2rem",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    justifyContent: "center",
                }}
            ></Box>
            <Box
                sx={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    color: "white",
                }}
            >
                <Box sx={{ mt: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                        }}
                    >
                        {allFilters.slice(0, 5).map((filter) => {
                            const isActive =
                                filter.key === "includeAdult"
                                    ? filters[filter.key] === true
                                    : filters[filter.key] !== undefined && filters[filter.key] !== "" && filters[filter.key] !== null;
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
                                        transition: "background-color 0.2s ease",
                                        cursor: "pointer",
                                        "&:hover": {
                                            bgcolor: isActive ? "rgba(0,150,255,0.35)" : "rgba(255,255,255,0.2)",
                                        },
                                    }}
                                    onClick={(e) => openPopover(e, filter.key)}
                                >
                                    <Button
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleChange(filter.key, "");
                                            }}
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
                    </Box>

                    {isUltimateUser ? (
                        <>
                            <Box
                                sx={{
                                    mt: 3,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1.5,
                                    justifyContent: "center",
                                    width: "100%",
                                }}
                            >
                                {allFilters.slice(5).map((filter, index) => {
                                    const isActive =
                                        filter.key === "includeAdult"
                                            ? filters[filter.key] === true
                                            : filters[filter.key] !== undefined &&
                                            filters[filter.key] !== "" &&
                                            filters[filter.key] !== null;

                                    return (
                                        <Box
                                            key={filter.key}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.8,
                                                position: 'relative',
                                                background: isActive
                                                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)'
                                                    : 'linear-gradient(135deg, rgba(88, 28, 135, 0.6) 0%, rgba(124, 58, 237, 0.5) 100%)',
                                                border: isActive
                                                    ? '2px solid rgba(216, 180, 254, 0.6)'
                                                    : '1px solid rgba(216, 180, 254, 0.3)',
                                                borderRadius: "12px",
                                                px: 1.5,
                                                py: 0.7,
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                cursor: "pointer",
                                                boxShadow: isActive
                                                    ? 'inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 4px 16px rgba(168, 85, 247, 0.4), 0 2px 8px rgba(0, 0, 0, 0.5)'
                                                    : 'inset 0 1px 2px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(88, 28, 135, 0.3), 0 2px 6px rgba(0, 0, 0, 0.4)',
                                                overflow: 'hidden',
                                                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s backwards`,
                                                '@keyframes fadeInUp': {
                                                    from: {
                                                        opacity: 0,
                                                        transform: 'translateY(20px)'
                                                    },
                                                    to: {
                                                        opacity: 1,
                                                        transform: 'translateY(0)'
                                                    }
                                                },
                                                "&::before": {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '2px',
                                                    background: 'linear-gradient(90deg, transparent, rgba(216, 180, 254, 0.8), transparent)',
                                                    opacity: isActive ? 1 : 0,
                                                    transition: 'opacity 0.3s ease'
                                                },
                                                "&:hover": {
                                                    transform: "translateY(-3px) scale(1.02)",
                                                    border: '2px solid rgba(216, 180, 254, 0.6)',
                                                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%)',
                                                    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.12), 0 6px 20px rgba(168, 85, 247, 0.5), 0 3px 10px rgba(0, 0, 0, 0.6)',
                                                },
                                                "&:hover::before": {
                                                    opacity: 1
                                                }
                                            }}
                                            onClick={(e) => openPopover(e, filter.key)}
                                        >
                                            {/* Sparkle icon */}
                                            <Box sx={{
                                                fontSize: '0.85rem',
                                                filter: 'drop-shadow(0 0 4px rgba(216, 180, 254, 0.8))',
                                                animation: 'pulse 2s ease-in-out infinite',
                                                '@keyframes pulse': {
                                                    '0%, 100%': {
                                                        opacity: 0.8,
                                                        transform: 'scale(1)'
                                                    },
                                                    '50%': {
                                                        opacity: 1,
                                                        transform: 'scale(1.1)'
                                                    }
                                                }
                                            }}>
                                                ✦
                                            </Box>

                                            <Button
                                                sx={{
                                                    color: "#fff",
                                                    fontWeight: 700,
                                                    textTransform: "none",
                                                    p: 0,
                                                    minWidth: 0,
                                                    mr: 0,
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.3px',
                                                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                                                    background: 'transparent',
                                                    '&:hover': {
                                                        background: 'transparent'
                                                    }
                                                }}
                                            >
                                                {filter.label}
                                            </Button>

                                            {isActive && (
                                                <Box
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange(filter.key, "");
                                                    }}
                                                    sx={{
                                                        cursor: "pointer",
                                                        color: "#fff",
                                                        background: "linear-gradient(135deg, #ec4899, #be185d)",
                                                        borderRadius: "50%",
                                                        width: 20,
                                                        height: 20,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "0.9rem",
                                                        fontWeight: "bold",
                                                        lineHeight: 1,
                                                        boxShadow: '0 1px 4px rgba(236, 72, 153, 0.4)',
                                                        transition: 'all 0.2s ease',
                                                        "&:hover": {
                                                            transform: "scale(1.15) rotate(90deg)",
                                                            background: "linear-gradient(135deg, #f472b6, #ec4899)",
                                                            boxShadow: '0 2px 6px rgba(236, 72, 153, 0.6)',
                                                        }
                                                    }}
                                                >
                                                    ×
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}
                            </Box>
                        </>
                    ) : (
                        <Box
                            sx={{
                                mt: 3,
                                position: "relative",
                                width: "90%",
                                maxWidth: 900,
                                borderRadius: "20px",
                                background: "linear-gradient(145deg, #141414, #1e1e1e)",
                                boxShadow: "6px 6px 12px #0f0f0f, -6px -6px 12px #2a2a2a",
                                p: 3,
                                textAlign: "center",
                                color: "white",
                                zIndex: 1,
                            }}
                        >
                            <Box sx={{ mb: 1, fontSize: "1.1rem", fontWeight: 600 }}>
                                🔒 Unlock More Filters with{" "}
                                <span style={{ color: "#00c2ff" }}>Ultimate Critix</span>
                            </Box>

                            <Box sx={{ fontSize: "0.9rem", opacity: 0.8, mb: 2 }}>
                                Access advanced discovery filters like certifications, monetization types,
                                and provider exclusions.
                            </Box>

                            <Button
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(90deg, #00b7ff, #0072ff)",
                                    borderRadius: "25px",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    px: 3,
                                    py: 1,
                                    "&:hover": {
                                        background: "linear-gradient(90deg, #0094ff, #0059ff)",
                                    },
                                }}
                                href="/ultimate"
                            >
                                Upgrade to Ultimate
                            </Button>

                            {/* Dimmed preview of locked filters */}
                            <Box
                                sx={{
                                    mt: 2,
                                    filter: "blur(2px) brightness(0.6)",
                                    pointerEvents: "none",
                                    userSelect: "none",
                                    opacity: 0.4,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    justifyContent: "center",
                                    maxHeight: "80px",
                                    overflow: "hidden",
                                }}
                            >
                                {allFilters.slice(5).map((filter) => (
                                    <Box
                                        key={filter.key}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            bgcolor: "rgba(255,255,255,0.1)",
                                            borderRadius: 2,
                                            pl: 1,
                                            pr: 0.5,
                                            py: 0.5,
                                        }}
                                    >
                                        <Button
                                            sx={{
                                                color: "#ccc",
                                                textTransform: "none",
                                                p: 0,
                                                minWidth: 0,
                                                mr: 1,
                                                fontSize: "0.85rem",
                                            }}
                                        >
                                            {filter.label}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={closePopover}
                        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                        transformOrigin={{ vertical: "top", horizontal: "center" }}
                        PaperProps={{ sx: { p: 2, minWidth: 250 } }}
                    >
                        {activeFilter && renderField(allFilters.find((f) => f.key === activeFilter))}
                    </Popover>

                    <Button onClick={clearAllFilters} variant="outlined">
                        Clear All Filters
                    </Button>
                </Box>
            </Box>
        </Box >
    )
}

DiscoverSearch.propTypes = {
    onSubmit: PropTypes.func,
};
