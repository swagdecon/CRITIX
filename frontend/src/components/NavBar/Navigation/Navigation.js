import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import PremiumIcon from "../../Other/crown.webp"
import NavStyle from './Navigation.module.css'

export default function Navigation() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={NavStyle.Navigation}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon fontSize="large"
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        sx={{
          mt: "1px",
          "& .MuiMenu-paper": {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
          },
          "& .MuiMenuItem-root a": {
            transition: "color 0.3s",
            color: "white",
            "&:hover": {
              color: "#0096ff",
            },
          },
        }}
      >
        <Link to="/now_playing/" onClick={handleClose} style={{ textDecoration: "none" }}>
          <MenuItem>IN THEATRES</MenuItem>
        </Link>
        <Link to="/upcoming/" onClick={handleClose} style={{ textDecoration: "none" }}>
          <MenuItem>UPCOMING</MenuItem>
        </Link>
        <Link to="/popular/" onClick={handleClose} style={{ textDecoration: "none" }}>
          <MenuItem>MOST POPULAR</MenuItem>
        </Link>
        <Link to="/watchlist" onClick={handleClose} style={{ textDecoration: "none" }}>
          <MenuItem>WATCHLIST</MenuItem>
        </Link>
        <MenuItem onClick={handleClose}> <Link to="/recommendations">
          <img src={PremiumIcon} alt="Premium" style={{ width: '20px', marginRight: '8px' }} /> RECOMMENDED
        </Link></MenuItem>
        <Link to="/discover-movies" onClick={handleClose} style={{ textDecoration: "none" }}>
          <MenuItem>
            <img src={PremiumIcon} alt="Premium" style={{ width: '20px', marginRight: '8px' }} />
            DISCOVER
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}

