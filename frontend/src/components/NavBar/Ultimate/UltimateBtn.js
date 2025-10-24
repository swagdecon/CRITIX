import React from "react"
import MovieFilterIcon from "@mui/icons-material/MovieFilter";
import { Link } from "react-router-dom";
import styles from "./UltimateBtn.module.css";

export default function UltimateBtn() {
    return (
        <div className={styles.UltimateBtn}>
            <Link to="/ultimate" className={styles.link}>
                <button className={styles.coolButton}>
                    <MovieFilterIcon className={styles.icon} />
                    <span>CRITIX ULTIMATE</span>
                </button>
            </Link>
        </div>
    );
}
