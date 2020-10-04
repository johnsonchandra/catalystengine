/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role, jsx-a11y/anchor-is-valid */

import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ total, perPage, currentPage, onChangePage }) => {
  const pages = [];
  const pagesToGenerate = Math.ceil(total / perPage);

  for (let pageNumber = 1; pageNumber <= pagesToGenerate; pageNumber += 1) {
    pages.push(
      <li
        role="button"
        key={`pagination_${pageNumber}`}
        className={pageNumber === currentPage ? 'active' : ''}
        onClick={() => onChangePage(pageNumber)}
        onKeyDown={() => onChangePage(pageNumber)}
      >
        <a href="#" role="button" onClick={(event) => event.preventDefault()}>
          {pageNumber}
        </a>
      </li>,
    );
  }

  return <ul className="pagination pagination-md">{pages}</ul>;
};

Pagination.propTypes = {
  total: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export default Pagination;
