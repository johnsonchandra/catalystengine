import UserSetting from '../../index';

import parseHost from '../../../../../helpers/parseHost';
import isAdmin from '../../../../../helpers/isAdmin';

export default {
  userSettings: (parent, args, context) => {
    const host = parseHost(context.headers.origin);

    if (!isAdmin(context.user._id, host)) {
      throw new Error('Sorry, you need to be an administrator to do this.');
    }

    return UserSetting.find({ host }, { sort: { key: 1 } }).fetch();
  },
  userSettingsAll: (parent, args, context) => {
    if (!isAdmin(context.user._id)) {
      throw new Error('Sorry, you need to be an Root administrator to do this.');
    }

    return UserSetting.find({}, { sort: { key: 1 } }).fetch();
  },
};
