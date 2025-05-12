import React from 'react';

const SearchFilter = ({ 
  searchQuery, 
  onSearchChange, 
  currentCategory, 
  onCategoryChange 
}) => {
  return (
    <div className="filter-search-bar">
      <input
        type="text"
        id="search-input"
        placeholder="Search movies by title..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <div className="category-filter">
        <form>
          <label className="filter-movie">Category Filter:</label>
          <select
            id="category-select"
            value={currentCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="popular">popular</option>
            <option value="now_playing">now_playing</option>
            <option value="top_rated">top_rated</option>
            <option value="upcoming">upcoming</option>
          </select>
        </form>
      </div>
    </div>
  );
};

export default SearchFilter;