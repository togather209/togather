import React from "react";
import "./Pagination.css";

const Pagination = ({ pagination }) => {
  const createPagination = () => {
    let pages = [];
    for (let i = 1; i <= pagination.last; i++) {
      pages.push(
        <a
          key={i}
          href="#"
          className={`${i === pagination.current ? "on" : ""} pagination-a-tag`}
          onClick={(e) => {
            e.preventDefault();
            pagination.gotoPage(i);
          }}
        >
          {i}
        </a>
      );
    }
    return pages;
  };

  return <div id="pagination">{createPagination()}</div>;
};

export default Pagination;
