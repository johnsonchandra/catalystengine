import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';

import Styles from './styles';

class UserLogoutPage extends React.Component {
  componentDidMount() {
    const { setAfterLoginPath } = this.props;
    Meteor.logout(() => setAfterLoginPath(null));
  }

  render() {
    return (
      <Styles.UserLogout>
        <h1>You are now logged OUT</h1>
      </Styles.UserLogout>
    );
  }
}

UserLogoutPage.propTypes = {
  setAfterLoginPath: PropTypes.func.isRequired,
};

export default UserLogoutPage;
