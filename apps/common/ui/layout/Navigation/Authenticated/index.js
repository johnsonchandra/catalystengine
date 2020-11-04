import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { MenuItem, Nav, NavDropdown, NavItem } from 'react-bootstrap';

import { LinkContainer } from 'react-router-bootstrap';

const CommonNavigationAuthenticated = ({ userId, name, roles, history }) => (
  <div>
    {roles.indexOf('member') > -1 && (
      <Nav>
        <LinkContainer to="/Document">
          <NavItem eventKey="Document" href="/Document">
            Document
          </NavItem>
        </LinkContainer>
        <LinkContainer to="/File">
          <NavItem eventKey="File" href="/File">
            File
          </NavItem>
        </LinkContainer>
      </Nav>
    )}
    <Nav pullRight>
      {Roles.userIsInRole(userId, 'admin') && (
        <NavDropdown
          eventKey="root"
          title="Root"
          data-test="root-nav-dropdown"
          id="root-nav-dropdown"
        >
          <LinkContainer exact to="/Root/User">
            <NavItem eventKey="Root_User" href="/Root/User">
              User All
            </NavItem>
          </LinkContainer>
          <LinkContainer exact to="/Root/Org">
            <NavItem eventKey="Root_Org" href="/Root/Org">
              Org All
            </NavItem>
          </LinkContainer>
          <LinkContainer exact to="/Root/Tenant">
            <NavItem eventKey="Root_Tenant" href="/Root/Tenant">
              Tenant
            </NavItem>
          </LinkContainer>
          <LinkContainer exact to="/Root/UserSetting">
            <NavItem eventKey="Root_UserSetting" href="/Root/UserSetting">
              UserSetting
            </NavItem>
          </LinkContainer>
        </NavDropdown>
      )}
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
          <LinkContainer exact to="/File">
            <NavItem eventKey="File" href="/File">
              File
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

CommonNavigationAuthenticated.propTypes = {
  userId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withRouter(CommonNavigationAuthenticated);
