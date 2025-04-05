import React from "react"
import { Link } from "react-router-dom"
import Button from '@mui/material/Button';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
export default function PremiumBtn() {
    return (
        <Link to="/premium">
            <Button startIcon={<MovieFilterIcon />} variant="contained" sx={{ backgroundColor: "#6C3BAA" }}>PREMIUM</Button>
        </Link>
    )
}