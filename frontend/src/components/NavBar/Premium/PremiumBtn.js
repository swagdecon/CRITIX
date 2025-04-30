import React from "react"
import { Button } from "@mui/material";
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { Link } from "react-router-dom";
import PremiumBtnStyles from "./PremiumBtn.module.css";

export default function PremiumBtn() {
    return (
        <div className={PremiumBtnStyles.PremiumBtn}>
            <Link to="/premium" className={PremiumBtnStyles.link}>
                <Button
                    startIcon={<MovieFilterIcon />}
                    variant="contained"
                    className={PremiumBtnStyles.coolButton}
                >
                    PREMIUM
                </Button>
            </Link>
        </div>
    );
}
