import React from "react"
import { Button } from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { Link } from "react-router-dom";
import PremiumBtnStyles from "./PremiumBtn.module.css";

export default function PremiumBtn() {
    return (
        <div className={PremiumBtnStyles.PremiumBtn}>
            <Link to="/ultimate" className={PremiumBtnStyles.link}>
                <Button
                    startIcon={<MovieFilterIcon />}
                    sx={{
                        backgroundColor: "#0096ff",
                        "&:hover": {
                            backgroundColor: "#0096ff", // darker on hover
                        },
                    }}
                >
                    PREMIUM
                </Button>
            </Link>
        </div>
    );
}
