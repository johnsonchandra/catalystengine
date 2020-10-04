import { Meteor } from 'meteor/meteor';

import isAdmin from '../../../../../helpers/isAdmin';
import parseHost from '../../../../../helpers/parseHost';
import entityInsert from '../../../../../helpers/server/entityInsert';
import entityUpdate from '../../../../../helpers/server/entityUpdate';
import parseMemberFromContext from '../../../../../helpers/parseMemberFromContext';

import updateSettingOnUsers from './updateSettingOnUsers';
import addSettingToUsers from './addSettingToUsers';

import UserSetting from '../..';
import parseDotToUnderscore from '../../../../../helpers/parseDotToUnderscore';

export default {
  addUserSetting(parent, args, context) {
    const host = parseHost(context.headers.origin);
    if (!isAdmin(context.user._id, host)) {
      throw new Error('Sorry, you must be an admin to do this.');
    }

    if (UserSetting.findOne({ key: args.setting.key })) {
      throw new Error('Sorry, this user setting already exists.');
    }

    const party = parseMemberFromContext(context);

    const { setting } = args;
    setting.host = setting.host && isAdmin(context.user._id) ? setting.host : host;

    const docUserSetting = { ...setting, setByUser: false };
    docUserSetting._id = entityInsert(
      UserSetting,
      docUserSetting,
      'admin creates new setting',
      party,
    );

    addSettingToUsers({
      setting: docUserSetting,
      context,
    });

    return docUserSetting;
  },

  updateUserSetting(parent, args, context) {
    const host = parseHost(context.headers.origin);

    if (!isAdmin(context.user._id, host)) {
      throw new Error('Sorry, you must be an admin to do this.');
    }

    const party = parseMemberFromContext(context);

    entityUpdate(
      UserSetting,
      { _id: args.setting._id },
      args.setting,
      'admin update setting',
      party,
    );
    updateSettingOnUsers({ setting: args.setting, context });
  },

  removeUserSetting(parent, args, context) {
    if (!isAdmin(context.user._id, parseHost(context.headers.origin))) {
      throw new Error('Sorry, you must be an admin to do this.');
    }

    const host =
      args.host && isAdmin(context.user._id) ? args.host : parseHost(context.headers.origin);

    const docPull = {};
    docPull[`hosts.${parseDotToUnderscore(host)}.settings`] = { _id: args._id };

    Meteor.users.update({}, { $pull: docPull }, { multi: true }, () => {
      UserSetting.remove({ _id: args._id });
    });

    return { _id: args._id };
  },
};
