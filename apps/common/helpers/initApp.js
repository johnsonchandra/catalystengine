import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import Tenant from '../entities/Tenant/api';
import parseHost from './parseHost';

const initApp = () => {
  const app = Meteor.subscribe('app');
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !app.ready() && !Roles.subscription.ready();
  const name = user && user.profile && (user.profile.shortname || user.profile.fullname);
  const emailAddress = user && user.emails && user.emails[0].address;
  const emailVerified = user && user.emails && user.emails[0] && user.emails[0].verified;
  const tenant = Tenant.findOne();
  const roles = Roles.getRolesForUser(userId, parseHost(window.location.hostname));

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    user,
    userId,
    emailAddress,
    emailVerified,
    roles,
    settings: tenant && tenant.settings,
    host: tenant && tenant.host,
  };
};

export default initApp;
