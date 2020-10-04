import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import _ from 'lodash';

import parseHost from '../../../../../helpers/parseHost';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';
import checkOptions from '../../../../../helpers/checkOptions';
import isAdmin from '../../../../../helpers/isAdmin';

const updateUserSettings = (userToUpdate, party, host) => {
  try {
    const user = Meteor.users.findOne(userToUpdate._id);
    const hostDotToUnderscore = parseDotToUnderscore(host);

    const settings =
      user &&
      user.hosts &&
      user.hosts[hostDotToUnderscore] &&
      user.hosts[hostDotToUnderscore].settings;
    if (!settings) throw new Error(`User Settings for ${host} not found`);

    const newSettings = [];

    settings.forEach((setting) => {
      const indexFound = _.findIndex(userToUpdate.settings, {
        _id: setting._id,
      });

      const newSetting = indexFound < 0 ? setting : userToUpdate.settings[indexFound];
      newSettings.push({
        ...newSetting,
        host: newSetting.host || host,
      });
    });

    const doc = {};
    doc[`hosts.${hostDotToUnderscore}.settings`] = newSettings;

    return entityUpdate(
      Meteor.users,
      { _id: userToUpdate._id },
      doc,
      `update user settings for host ${host}`,
      party,
    );
  } catch (exception) {
    throw new Error(`[updateUser.updateUserSettings] ${exception.message}`);
  }
};

const updateUserProfile = ({ _id, profile }, party) => {
  try {
    const now = new Date();
    return entityUpdate(
      Meteor.users,
      { _id },
      {
        'profile.fullname': profile.fullname,
        'profile.shortname': profile.shortname,
        'profile.phone': profile.phone,
      },
      'update user profile',
      party,
      now,
    );
  } catch (exception) {
    throw new Error(`[updateUser.updateUserProfile] ${exception.message}`);
  }
};

const updateUserEmail = ({ _id, email }, party) => {
  try {
    const now = new Date();
    return entityUpdate(
      Meteor.users,
      { _id },
      { 'emails.0.address': email, 'emails.0.verified': false },
      'update primary email',
      party,
      now,
    );
  } catch (exception) {
    throw new Error(`[updateUser.updateUserEmail] ${exception.message}`);
  }
};

const updateUserPassword = ({ _id, password }, party) => {
  try {
    const now = new Date();
    entityUpdate(Meteor.users, { _id }, {}, 'update password', party, now);
    return Accounts.setPassword(_id, password);
  } catch (exception) {
    throw new Error(`[updateUser.updateUserPassword] ${exception.message}`);
  }
};

const updateUser = (options, resolve, reject) => {
  try {
    checkOptions(options, (params) => {
      if (!params.args) throw new Error('args is required.');
      if (!params.args.user) throw new Error('args.user is required.');
    });

    const { args, context } = options;
    const host = parseHost(context.headers.origin);

    // only admin or user self can update
    if (!(args.user._id === context.user._id || isAdmin(context.user._id, host)))
      throw new Error('You dont have the authorization to update User');

    const party = parseMemberFromContext(context);
    const userToUpdate = options.args.user;

    if (userToUpdate.password) updateUserPassword(userToUpdate, party);
    if (userToUpdate.email) updateUserEmail(userToUpdate, party);
    if (userToUpdate.profile) updateUserProfile(userToUpdate, party);
    if (userToUpdate.settings) updateUserSettings(userToUpdate, party, host);

    resolve();
  } catch (exception) {
    reject(`[updateUser] ${exception.message}`);
  }
};

export default (options) =>
  new Promise((resolve, reject) => {
    updateUser(options, resolve, reject);
  });
