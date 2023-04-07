import React from "react";
import "./Search.css";
import PropTypes from "prop-types";
const Search = (props) => {
  return (
    <form onSubmit={props.onSubmit} id="search" className="Search">
      <input type="search" placeholder="Search for a title..." />
    </form>
  );
};
Search.propTypes = {
  onSubmit: PropTypes.func,
};
export default Search;
