import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

const ExampleNavigationAuthenticated = ({ name, history, roles }) => (
  <div>
    <Nav>
      {roles.indexOf('member') > -1 && (
        <LinkContainer exact to="/Document">
          <NavItem eventKey={1} href="/Document">
            Document
          </NavItem>
        </LinkContainer>
      )}
    </Nav>
    <Nav pullRight>
      {roles.indexOf('admin') > -1 && (
        <NavDropdown
          eventKey="admin"
          title="Admin"
          data-test="admin-nav-dropdown"
          id="admin-nav-dropdown"
        >
          <LinkContainer exact to="/User">
            <NavItem eventKey="User" href="/User">
              User
            </NavItem>
          </LinkContainer>
          <LinkContainer exact to="/Org">
            <NavItem eventKey="Org" href="/Org">
              Org
            </NavItem>
          </LinkContainer>
          <LinkContainer exact to="/Counter">
            <NavItem eventKey="Counter" href="/Counter">
              Counter
            </NavItem>
          </LinkContainer>
          <LinkContainer exact to="/UserSetting">
            <NavItem eventKey="UserSetting" href="/UserSetting">
              UserSetting
            </NavItem>
          </LinkContainer>
        </NavDropdown>
      )}

      <NavDropdown
        eventKey="user"
        title={name}
        data-test="user-nav-dropdown"
        id="user-nav-dropdown"
      >
        <LinkContainer to="/profile">
          <NavItem eventKey="user_profile" href="/profile">
            Profile
          </NavItem>
        </LinkContainer>
        <MenuItem divider />
        <MenuItem eventKey="user_logout" onClick={() => history.push('/logout')}>
          Logout
        </MenuItem>
      </NavDropdown>
    </Nav>
  </div>
);

ExampleNavigationAuthenticated.propTypes = {
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withRouter(ExampleNavigationAuthenticated);
