import React from "react"
import { Link } from "react-router-dom"
import Button from '@mui/material/Button';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import PremiumBtnStyles from "./PremiumBtn.module.css"
export default function PremiumBtn() {
    return (
        <div className={PremiumBtnStyles.PremiumBtn}>
            <Link to="/premium" className={PremiumBtnStyles.link}>
                <Button
                    startIcon={<MovieFilterIcon />}
                    variant="contained"
                    sx={{ backgroundColor: "#6C3BAA" }}
                >
                    PREMIUM
                </Button>
            </Link>
        </div>
    );
}