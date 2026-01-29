import React, { useState } from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="search-bar-terminal">
      {/* 맥북 창 헤더 */}
      <div className="terminal-window-header">
        <div className="window-controls">
          <span className="window-dot dot-red"></span>
          <span className="window-dot dot-yellow"></span>
          <span className="window-dot dot-green"></span>
        </div>
        <span className="window-title">search.sh</span>
      </div>

      {/* 터미널 바디 */}
      <form onSubmit={handleSubmit} className="terminal-body">
        <div className="search-input-wrapper">
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            placeholder="search posts..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="search-input"
          />
          {keyword && (
            <button type="button" onClick={handleClear} className="clear-button">
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;