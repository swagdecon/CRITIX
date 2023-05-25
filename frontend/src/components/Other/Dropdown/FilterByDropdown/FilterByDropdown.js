import React from "react";
import DropdownButton from "../../../../../node_modules/react-bootstrap/DropdownButton";
import Dropdown from "../../../../../node_modules/react-bootstrap/Dropdown";
import "../dropdown.css";

export default function FilterByButton() {
  return (
    <div className="button-container">
      <DropdownButton
        id="dropdown-button-dark"
        variant="secondary"
        menuVariant="dark"
        title="FILTER BY"
        className="mt-2"
      >
        <Dropdown.Item href="#/action-1" active>
          A-Z
        </Dropdown.Item>
        <Dropdown.Item href="#/action-2">Z-A</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Popularity Ascending</Dropdown.Item>
        <Dropdown.Item href="#/action-4">Popularity Descending</Dropdown.Item>
      </DropdownButton>
    </div>
  );
}
