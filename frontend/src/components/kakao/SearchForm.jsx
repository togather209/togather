import React, { useState, useEffect } from "react";
import "./SearchForm.css";
import Search from "../../assets/schedule/search.png";

const SearchForm = ({ onSearch, onOpenSearch, isOpenSearch }) => {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(keyword);
  };

  useEffect(() => {
    setKeyword("");
  }, [isOpenSearch]);

  return (
    <form
      onSubmit={handleSubmit}
      className="schedule-detail-header-search-container"
    >
      <input
        className="schedule-detail-header-search"
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        size="15"
        onFocus={onOpenSearch}
      />
      {isOpenSearch ? (
        <button className="search-button" type="submit">
          <img className="search-button-img" src={Search} alt="돋보기" />
        </button>
      ) : (
        <></>
      )}
    </form>
  );
};

export default SearchForm;
