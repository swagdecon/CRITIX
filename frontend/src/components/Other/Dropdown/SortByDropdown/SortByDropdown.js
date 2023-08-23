import { React, useState } from "react";
import "../dropdown.css";
import PropTypes from "prop-types";

import DropdownButton from "../../../../../node_modules/react-bootstrap/DropdownButton";
import Dropdown from "../../../../../node_modules/react-bootstrap/Dropdown";
export default function SortByButton({ onSelectSortBy }) {
  SortByButton.propTypes = {
    onSelectSortBy: PropTypes.func,
  };
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelect = (eventKey) => {
    setSelectedValue(eventKey);
    onSelectSortBy(eventKey);
  };
  return (
    <div className="mb-2">
      <DropdownButton
        key="down-centered"
        id={"dropdown-button-drop-down-centered"}
        drop="down-centered"
        title={`SORT BY: ${selectedValue}`}
        onSelect={handleSelect}
        variant="dark"
        data-bs-theme="dark"
      >
        <Dropdown.Item eventKey="Popularity Desc.">
          Popularity Descending
        </Dropdown.Item>
        <Dropdown.Item eventKey="Popularity Asc.">
          Popularity Ascending
        </Dropdown.Item>
        <Dropdown.Item eventKey="A-Z">A-Z</Dropdown.Item>
        <Dropdown.Item eventKey="Z-A">Z-A</Dropdown.Item>
        <Dropdown.Item eventKey="Vote Average Desc.">
          Vote Average Descending
        </Dropdown.Item>
        <Dropdown.Item eventKey="Vote Average Asc.">
          Vote Average Ascending
        </Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
