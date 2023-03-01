import React, { Component } from 'react';
import Header from '../Header/Header';
import "./Container.css"

class Container extends Component {
  constructor(props) {
    super(props);
    this.apiKey = '87dfa1c669eea853da609d4968d294be';
    this.state = { data: [] };
  }

  performSearch = (e) => {
    e.preventDefault();
    const val = this.searchInput.value;
    const requestUrl =
      'https://api.themoviedb.org/3/search/multi?query=' +
      val +
      '&api_key=' +
      this.apiKey;

    fetch(requestUrl)
      .then(response => response.json())
      .then(data => this.setState({ data: data }))
      .catch(error => console.error(error));
  };

  render() {
    if (this.state.data.results) {
      console.log(this.state.data);
    }

    return (
      <div>
        <Header />
        <div className="Search">
          <form onSubmit={this.performSearch}>
            <input type="text" ref={input => this.searchInput = input} />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    );
  }
}

export default Container;
