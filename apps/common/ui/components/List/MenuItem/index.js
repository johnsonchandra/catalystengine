import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from 'react-bootstrap';

import Icon from '../../Icon';

const ListMenuItem = ({ total, history, link, title }) => {
  const pages = [];

  for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
    pages.push(
      <MenuItem key={pageNumber} onClick={() => history.push(`${link}/${pageNumber}`)}>
        <Icon iconStyle="solid" icon="qrcode" />
        {` Next ${pageNumber} ${title}`}
      </MenuItem>,
    );
  }

  return <React.Fragment>{pages}</React.Fragment>;
};

ListMenuItem.defaultProps = {
  title: '',
};

ListMenuItem.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
};

export default ListMenuItem;
