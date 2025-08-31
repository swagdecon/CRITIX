import React from "react"
import { Button } from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { Link } from "react-router-dom";
import UltimateBtnStyles from "./UltimateBtn.module.css";

export default function UltimateBtn() {

    return (
        <div className={UltimateBtnStyles.UltimateBtn}>
            <Link to="/ultimate" className={UltimateBtnStyles.link}>
                <Button
                    startIcon={<MovieFilterIcon />}
                    sx={{
                        backgroundColor: "#0096ff",
                        "&:hover": {
                            backgroundColor: "#0096ff",
                        },
                    }}
                >
                    CRITIX ULTIMATE
                </Button>
            </Link>
        </div>
    );
}
