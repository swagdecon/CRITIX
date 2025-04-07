import React from 'react'
import NavBar from '../components/NavBar/NavBar'
import DiscoverSearch from '../components/Discover/DiscoverSearch'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
export default function DiscoverMovies() {
    return (
        <>
            <NavBar />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DiscoverSearch />
            </LocalizationProvider>
        </>
    )
}