export const reviewInputStyles = {
    borderRadius: "15px",
    fieldSet: {
        borderRadius: "15px"
    },
    input: {
        color: "white !important"
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "white",
        },
        "&:hover fieldset": {
            borderColor: "#0096ff",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#0096ff",
        },
        "&.Mui-error fieldset": {
            borderColor: "red",
        },
    },
    width: "100%",
}

export const UserGraphStyle = {
    "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
        strokeWidth: "1",
        fill: "white"
    },
    "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
        fontFamily: "Roboto",
    },
    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
        strokeWidth: "0.5",
        fill: "white"
    },
    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
        stroke: "white",
        strokeWidth: 1
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-line": {
        stroke: "white",
        strokeWidth: 1
    },
}