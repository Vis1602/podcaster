import React from 'react';
import { debounce } from 'lodash';
import '../styles/SearchButton.css';

function SearchButton({ onSearch }) {
    const debouncedSearch = debounce(onSearch, 300);

    const handleInputChange = (event) => {
        debouncedSearch(event.target.value);
    };

    return (
        <div className="search">
            <label htmlFor="search-podcast" className="visually-hidden">Filter podcast</label>
            <input 
                id="search-podcast"
                type="text"
                placeholder="Filter podcast..."
                onChange={handleInputChange}
            />
        </div>
    );
}

export default SearchButton;