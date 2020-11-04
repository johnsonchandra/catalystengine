import React from 'react';
import PropTypes from 'prop-types';

import getWindowDimension from '../../getWindowDimension';

const ListMasonry = (props) => {
  const { width } = getWindowDimension();

  const columnWrapper = {};
  const result = [];

  const { columns, gap, maxWidth, children } = props;
  const columnsMax = width < maxWidth ? 1 : columns;

  // create columns
  for (let i = 0; i < columnsMax; i += 1) {
    columnWrapper[`column${i}`] = [];
  }

  for (let i = 0; i < children.length; i += 1) {
    const columnListMasonry = i % columnsMax;
    columnWrapper[`column${columnListMasonry}`].push(
      <div style={{ marginBottom: `${gap}px` }}>{children[i]}</div>,
    );
  }

  for (let i = 0; i < columnsMax; i += 1) {
    result.push(
      <div
        style={{
          marginLeft: `${i > 0 ? gap : 0}px`,
          flex: 1,
        }}
      >
        {columnWrapper[`column${i}`]}
      </div>,
    );
  }

  return <div style={{ display: 'flex' }}>{result}</div>;
};

ListMasonry.propTypes = {
  columns: PropTypes.number,
  gap: PropTypes.number,
  maxWidth: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

ListMasonry.defaultProps = {
  columns: 3,
  gap: 10,
  maxWidth: 768,
};

export default ListMasonry;
