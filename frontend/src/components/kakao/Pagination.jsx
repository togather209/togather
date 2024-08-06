import React from 'react';

const Pagination = ({ pagination }) => {
  const createPagination = () => {
    let pages = [];
    for (let i = 1; i <= pagination.last; i++) {
      pages.push(
        <a
          key={i}
          href="#"
          className={i === pagination.current ? 'on' : ''}
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
