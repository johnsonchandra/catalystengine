import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

const AccountingNavigationPublic = () => (
  <Nav pullRight>
    <LinkContainer to="/signup">
      <NavItem eventKey="signup" href="/signup">
        Sign Up
      </NavItem>
    </LinkContainer>
    <LinkContainer to="/login">
      <NavItem eventKey="login" href="/login">
        Log In
      </NavItem>
    </LinkContainer>
  </Nav>
);

export default AccountingNavigationPublic;
