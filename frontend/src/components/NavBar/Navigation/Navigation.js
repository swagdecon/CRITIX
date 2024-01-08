import React from "react";
import { Link } from "react-router-dom";
import NavStyle from "./Navigation.module.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
export default function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null);
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
      >
        <MenuItem onClick={handleClose}><Link to="/now_playing/">
          IN THEATRES
        </Link></MenuItem>
        <MenuItem onClick={handleClose}>  <Link to="/upcoming/">
          UPCOMING
        </Link></MenuItem>
        <MenuItem onClick={handleClose}> <Link to="/popular/">
          MOST POPULAR
        </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}> <Link to="/watchlist">
          WATCHLIST
        </Link> </MenuItem>
      </Menu>
    </div>
  );
}

