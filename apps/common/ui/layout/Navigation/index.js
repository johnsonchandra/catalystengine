import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CommonNavigationPublic from './Public';
import CommonNavigationAuthenticated from './Authenticated';

const CommonNavigation = (props) => {
  const { location, authenticated, settings } = props;

  if (location && location.pathname && location.pathname.includes('QRCode')) return <div />;

  return (
    <Navbar collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">{settings.productname}</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        {authenticated ? <CommonNavigationAuthenticated {...props} /> : <CommonNavigationPublic />}
      </Navbar.Collapse>
    </Navbar>
  );
};

CommonNavigation.defaultProps = {
  userId: undefined,
  name: '',
  location: undefined,
  settings: {},
  roles: [],
};

CommonNavigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  name: PropTypes.string,
  location: PropTypes.object,
  settings: PropTypes.object,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default CommonNavigation;
