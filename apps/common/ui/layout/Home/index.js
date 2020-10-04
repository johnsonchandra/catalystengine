import { Meteor } from 'meteor/meteor';

import React from 'react';

import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';

const HomeCommon = () => (Meteor.isClient && Meteor.userId() ? <LoggedIn /> : <LoggedOut />);

export default HomeCommon;
