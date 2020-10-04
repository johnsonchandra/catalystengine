import { Meteor } from 'meteor/meteor';

import React from 'react';

import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

const HomeExample = (props) =>
  Meteor.isClient && Meteor.userId() ? <LoggedIn {...props} /> : <LoggedOut {...props} />;

export default HomeExample;
