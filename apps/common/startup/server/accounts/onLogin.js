import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import Tenant from '../../../entities/Tenant/api';

import parseHost from '../../../helpers/parseHost';
import parseDotToUnderscore from '../../../helpers/parseDotToUnderscore';

import UserSetting from '../../../entities/UserSetting/api';

// TODO coba lihat apa yg terjadi bila login dari mobile hehehe
Accounts.onLogin((options) => {
  const host = parseHost(options.connection.httpHeaders.host);
  const tenant = Tenant.findOne({ host });

  // just add without checking first, because checking first add more steps
  Roles.addUsersToRoles(options.user._id, tenant.roleStandard, host);

  const timestamp = new Date();

  const modifier = {
    $push: {
      // FIXME dicap, tulis juga ke log tersendiri dengan tipe Login
      lastLogins: {
        host,
        timestamp,
        clientAddress: options.connection.clientAddress,
        httpHeaders: options.connection.httpHeaders,
      },
    },
  };

  const hostDotToUnderscore = parseDotToUnderscore(host);

  modifier.$set = {};
  modifier.$set[`hosts.${hostDotToUnderscore}.visit.last`] = {
    clientAddress: options.connection.clientAddress,
    httpHeaders: options.connection.httpHeaders,
    timestamp,
  };

  const selector = { _id: options.user._id };
  selector[`hosts.${hostDotToUnderscore}`] = { $exists: true };

  const userHasBeenInHost = Meteor.users.findOne(selector);
  if (!userHasBeenInHost) {
    // get user settings
    modifier.$set[`hosts.${hostDotToUnderscore}.settings`] = UserSetting.find({ host }).fetch();

    modifier.$set[`hosts.${hostDotToUnderscore}.visit.first`] = {
      clientAddress: options.connection.clientAddress,
      httpHeaders: options.connection.httpHeaders,
      timestamp,
    };
  }

  Meteor.users.update({ _id: options.user._id }, modifier);
});
