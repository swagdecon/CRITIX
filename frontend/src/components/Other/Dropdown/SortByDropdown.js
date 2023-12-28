import React, { useState, useEffect, useRef } from "react";
import DropdownStyle from "./dropdown.module.css";
import PropTypes from "prop-types";

export default function Dropdown({ onSelectSortBy, dropdownItems }) {
  const [selectedValue, setSelectedValue] = useState("↓");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (eventKey) => {
    setSelectedValue(eventKey);
    onSelectSortBy(eventKey);
    closeDropdown();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // const dropdownItems = [
  //   "Popularity Desc.",
  //   "Popularity Asc.",
  //   "A-Z",
  //   "Z-A",
  //   "Vote Average Desc.",
  //   "Vote Average Asc.",
  // ];

  return (
    <div className={DropdownStyle["horizontal-dropdown"]} ref={dropdownRef}>
      <div className={DropdownStyle["dropdown-header"]} onClick={toggleDropdown}>
        SORT BY: {selectedValue}
      </div>
      {isDropdownOpen && (
        <div className={DropdownStyle["dropdown-menu"]}>
          {dropdownItems.map((item, index) => (
            <button key={index} className={DropdownStyle["dropdown-item"]} onClick={() => handleSelect(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Dropdown.propTypes = {
  onSelectSortBy: PropTypes.func,
  dropdownItems: PropTypes.array
};
